import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { getServerSupabase, isSupabaseConfigured, PROJECT_MEDIA_BUCKET } from './supabase';
import { splitMediaUrls } from '@/data/projectsData';

const localFilePath = path.join(process.cwd(), 'data', 'projects.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_projects.json');

// In-memory cache for fast runtime fallback
let projectsMemoryCache: any[] | null = null;

export interface ProjectDbRecord {
  id: string;
  title: string;
  category: string;
  location?: string;
  capacity?: string;
  client?: string;
  folder?: string;
  images?: string;
  systemType?: string;
  completionDate?: string;
  annualYield?: string;
  co2Offset?: string;
  description?: string;
  highlights?: string[];
  tags?: string[];
  satelliteCategory?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transforms a front-end / JSON project record to Supabase DB column format
 */
function toDbPayload(p: any, sortOrder?: number) {
  return {
    id: p.id,
    title: p.title || 'Untitled Project',
    category: p.category || 'Commercial',
    location: p.location || '',
    capacity: p.capacity || '',
    client: p.client || '',
    folder: p.folder || '',
    images: Array.isArray(p.images) ? p.images.join(', ') : (p.images || ''),
    system_type: p.systemType || p.system_type || '',
    completion_date: p.completionDate || p.completion_date || '',
    annual_yield: p.annualYield || p.annual_yield || '',
    co2_offset: p.co2Offset || p.co2_offset || '',
    description: p.description || '',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    satellite_category: p.satelliteCategory || p.satellite_category || 'None',
    sort_order: typeof sortOrder === 'number' ? sortOrder : (p.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Transforms a Supabase DB row back to the camelCase format expected by the frontend
 */
function fromDbPayload(row: any) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location || '',
    capacity: row.capacity || '',
    client: row.client || '',
    folder: row.folder || '',
    images: row.images || '',
    systemType: row.system_type ?? row.systemType ?? '',
    completionDate: row.completion_date ?? row.completionDate ?? '',
    annualYield: row.annual_yield ?? row.annualYield ?? '',
    co2Offset: row.co2_offset ?? row.co2Offset ?? '',
    description: row.description || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    satelliteCategory: row.satellite_category ?? row.satelliteCategory ?? 'None',
    sort_order: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Local filesystem fallback reader
 */
async function readLocalProjects(): Promise<any[]> {
  if (projectsMemoryCache && Array.isArray(projectsMemoryCache) && projectsMemoryCache.length > 0) {
    return [...projectsMemoryCache];
  }

  // 1. Try reading from writable /tmp
  try {
    if (existsSync(tmpFilePath)) {
      const raw = await readFile(tmpFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        projectsMemoryCache = parsed;
        return [...parsed];
      }
    }
  } catch {}

  // 2. Fall back to bundled data file
  try {
    const raw = await readFile(localFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    projectsMemoryCache = parsed;
    return [...parsed];
  } catch (err) {
    console.error('Error reading projects.json:', err);
    return [];
  }
}

/**
 * Local filesystem fallback writer
 */
async function writeLocalProjects(data: any[]) {
  projectsMemoryCache = [...data];

  try {
    await writeFile(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Expected on read-only serverless host
  }

  try {
    await writeFile(tmpFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to tmp projects file:', err);
  }
}

/**
 * Uploads a buffer directly to Supabase Storage and returns its public CDN URL
 */
export async function uploadBufferToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const supabase = getServerSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured on the server.');
  }

  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `uploads/${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_MEDIA_BUCKET)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Supabase Storage upload error: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(PROJECT_MEDIA_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Converts a Base64 Data URL into a file and stores it in Supabase Storage,
 * replacing the multi-megabyte string with a fast public CDN URL.
 */
export async function migrateBase64ToStorage(dataUrl: string, namePrefix = 'media'): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;

  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return dataUrl;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const fileName = `${namePrefix}_${Date.now()}.${ext}`;

  return await uploadBufferToSupabaseStorage(buffer, fileName, mimeType);
}

/**
 * Scans a project's image list and migrates any Base64 strings to Supabase Storage
 */
async function sanitizeAndMigrateImages(imagesInput: string | undefined): Promise<string> {
  if (!imagesInput) return '';

  const mediaList = splitMediaUrls(imagesInput);
  const resolvedList: string[] = [];

  for (let i = 0; i < mediaList.length; i++) {
    const item = mediaList[i];
    if (item.startsWith('data:') && isSupabaseConfigured()) {
      try {
        const cdnUrl = await migrateBase64ToStorage(item, `proj_img_${i + 1}`);
        resolvedList.push(cdnUrl);
      } catch (err) {
        console.error('Failed to migrate Base64 item to Supabase Storage:', err);
        resolvedList.push(item);
      }
    } else {
      resolvedList.push(item);
    }
  }

  return resolvedList.join(', ');
}

/**
 * Fetch all projects from Supabase PostgreSQL with local JSON fallback & auto-seeding
 */
export async function getProjects(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data) {
          // If Supabase table is empty, seed it with the initial projects from projects.json
          if (data.length === 0) {
            const seedData = await readLocalProjects();
            if (seedData.length > 0) {
              const seedPayloads = seedData.map((p, idx) => toDbPayload(p, idx));
              const { error: seedError } = await supabase.from('projects').insert(seedPayloads);
              if (!seedError) {
                return seedData;
              }
            }
          }
          return data.map(fromDbPayload);
        }
        if (error) {
          console.warn('Supabase fetch error, using local fallback:', error.message);
        }
      }
    } catch (err) {
      console.warn('Supabase query failed, using local fallback:', err);
    }
  }

  return await readLocalProjects();
}

/**
 * Insert or update a project record in Supabase with local fallback
 */
export async function saveProject(project: any, isNew = false): Promise<any> {
  // Sanitize any Base64 images to Supabase storage CDN URLs if possible
  const sanitizedImages = await sanitizeAndMigrateImages(project.images);
  const updatedProject = {
    ...project,
    images: sanitizedImages,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const payload = toDbPayload(updatedProject);
        const { data, error } = await supabase
          .from('projects')
          .upsert(payload, { onConflict: 'id' })
          .select()
          .single();

        if (!error && data) {
          const formatted = fromDbPayload(data);
          // Keep local cache in sync
          const localList = await readLocalProjects();
          const existingIdx = localList.findIndex((p) => p.id === formatted.id);
          if (existingIdx >= 0) {
            localList[existingIdx] = formatted;
          } else {
            localList.unshift(formatted);
          }
          await writeLocalProjects(localList);
          return formatted;
        }

        if (error) {
          console.error('Supabase save error:', error.message);
          throw new Error(`Database error: ${error.message}`);
        }
      }
    } catch (err) {
      console.error('Supabase upsert failed:', err);
      if (err instanceof Error && err.message.startsWith('Database error:')) {
        throw err;
      }
    }
  }

  // Fallback to local files
  const localList = await readLocalProjects();
  const existingIdx = localList.findIndex((p) => p.id === updatedProject.id);

  if (existingIdx >= 0) {
    localList[existingIdx] = updatedProject;
  } else if (isNew) {
    localList.unshift(updatedProject);
  } else {
    localList.push(updatedProject);
  }

  await writeLocalProjects(localList);
  return updatedProject;
}

/**
 * Delete a project record
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete error:', error.message);
          throw new Error(`Database error: ${error.message}`);
        }
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
      if (err instanceof Error && err.message.startsWith('Database error:')) {
        throw err;
      }
    }
  }

  const localList = await readLocalProjects();
  const filtered = localList.filter((p) => p.id !== id);
  await writeLocalProjects(filtered);
  return true;
}

/**
 * Reorder projects
 */
export async function reorderProjects(projectIds: string[]): Promise<any[]> {
  const currentList = await getProjects();
  const map = new Map(currentList.map((p) => [p.id, p]));

  const reordered: any[] = [];
  projectIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      reordered.push({ ...item, sort_order: idx });
      map.delete(id);
    }
  });

  // Append any projects omitted from the reorder array
  map.forEach((item) => {
    reordered.push({ ...item, sort_order: reordered.length });
  });

  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const updates = reordered.map((p, idx) => ({
          id: p.id,
          sort_order: idx,
          updated_at: new Date().toISOString(),
        }));

        for (const update of updates) {
          await supabase.from('projects').update({ sort_order: update.sort_order }).eq('id', update.id);
        }
      }
    } catch (err) {
      console.warn('Supabase reorder sync warning:', err);
    }
  }

  await writeLocalProjects(reordered);
  return reordered;
}
