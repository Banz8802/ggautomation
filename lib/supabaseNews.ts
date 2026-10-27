import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { getServerSupabase, isSupabaseConfigured } from './supabase';

const localFilePath = path.join(process.cwd(), 'data', 'news.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_news.json');

// In-memory cache for fast runtime fallback
let newsMemoryCache: any[] | null = null;

export interface NewsDbRecord {
  id: string;
  title: string;
  category: string;
  date?: string;
  formatted_date?: string;
  display_dates?: string[];
  author_or_host?: string;
  location?: string;
  locations?: string[];
  image?: string;
  images?: string[];
  summary?: string;
  full_content?: string[];
  highlights?: string[];
  contact_info?: Record<string, any>;
  tags?: string[];
  is_upcoming_event?: boolean;
  is_past_event?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transforms front-end NewsArticle object to Supabase PostgreSQL table columns
 */
export function toDbPayload(article: any): Record<string, any> {
  const cleanDates = Array.isArray(article.displayDates)
    ? article.displayDates.filter(Boolean)
    : (article.display_dates || []);

  const cleanLocations = Array.isArray(article.locations)
    ? article.locations.filter(Boolean)
    : [];

  const cleanImages = Array.isArray(article.images)
    ? article.images.filter(Boolean)
    : (article.image ? [article.image] : []);

  const primaryImage = cleanImages[0] || article.image || '/images/hero-solar-engineering.webp';

  return {
    id: article.id,
    title: article.title || 'Untitled Article',
    category: article.category || 'General Update',
    date: article.date || new Date().toISOString().split('T')[0],
    formatted_date: article.formattedDate || article.formatted_date || '',
    display_dates: cleanDates,
    author_or_host: article.authorOrHost || article.author_or_host || 'GG Automation Team',
    location: article.location || '',
    locations: cleanLocations,
    image: primaryImage,
    images: cleanImages.length > 0 ? cleanImages : [primaryImage],
    summary: article.summary || '',
    full_content: Array.isArray(article.fullContent) ? article.fullContent : (article.full_content || []),
    highlights: Array.isArray(article.highlights) ? article.highlights : [],
    contact_info: article.contactInfo || article.contact_info || {},
    tags: Array.isArray(article.tags) ? article.tags : [],
    is_upcoming_event: Boolean(article.isUpcomingEvent ?? article.is_upcoming_event),
    is_past_event: Boolean(article.isPastEvent ?? article.is_past_event),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Transforms Supabase PostgreSQL table row to front-end NewsArticle object
 */
export function fromDbPayload(row: any): Record<string, any> {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    formattedDate: row.formatted_date || row.formattedDate || '',
    displayDates: Array.isArray(row.display_dates) ? row.display_dates : (row.displayDates || []),
    authorOrHost: row.author_or_host || row.authorOrHost || 'GG Automation Team',
    location: row.location || '',
    locations: Array.isArray(row.locations) ? row.locations : [],
    image: row.image || '',
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : (row.image ? [row.image] : []),
    summary: row.summary || '',
    fullContent: Array.isArray(row.full_content) ? row.full_content : (row.fullContent || []),
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    contactInfo: row.contact_info || row.contactInfo || {},
    tags: Array.isArray(row.tags) ? row.tags : [],
    isUpcomingEvent: Boolean(row.is_upcoming_event ?? row.isUpcomingEvent),
    isPastEvent: Boolean(row.is_past_event ?? row.isPastEvent),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Reads local news.json with in-memory caching and /tmp fallback
 */
export async function readLocalNews(): Promise<any[]> {
  // In development, prioritize reading the repository file directly so updates are always fresh
  if (process.env.NODE_ENV !== 'production') {
    try {
      if (existsSync(localFilePath)) {
        const raw = await readFile(localFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          newsMemoryCache = parsed;
          return [...parsed];
        }
      }
    } catch {}
  }

  if (newsMemoryCache && Array.isArray(newsMemoryCache) && newsMemoryCache.length > 0) {
    return [...newsMemoryCache];
  }

  // 1. Try reading from writable /tmp
  try {
    if (existsSync(tmpFilePath)) {
      const raw = await readFile(tmpFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        newsMemoryCache = parsed;
        return [...parsed];
      }
    }
  } catch {}

  // 2. Fall back to bundled data file
  try {
    if (existsSync(localFilePath)) {
      const raw = await readFile(localFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      newsMemoryCache = parsed;
      return [...parsed];
    }
  } catch (err) {
    console.error('Error reading news.json:', err);
  }

  return [];
}

/**
 * Writes news data to local disk / tmp cache
 */
export async function writeLocalNews(data: any[]): Promise<void> {
  newsMemoryCache = [...data];

  // Try writing to local project directory (works in local dev)
  try {
    await writeFile(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem on Vercel - expected
  }

  // Always write to /tmp for serverless instance persistence
  try {
    await writeFile(tmpFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to tmp news file:', err);
  }
}

/**
 * Fetches all news articles from Supabase with local JSON fallback & auto-seeding
 */
export async function getNews(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data) {
          // If Supabase table is empty, auto-seed with news.json so existing articles are preserved
          if (data.length === 0) {
            const seedData = await readLocalNews();
            if (seedData.length > 0) {
              const seedPayloads = seedData.map(toDbPayload);
              const { error: seedError } = await supabase.from('news').insert(seedPayloads);
              if (!seedError) {
                return seedData;
              }
            }
          }
          return data.map(fromDbPayload);
        }
        if (error) {
          console.warn('Supabase news fetch error, using local fallback:', error.message);
        }
      }
    } catch (err) {
      console.warn('Supabase news query failed, using local fallback:', err);
    }
  }

  return await readLocalNews();
}

/**
 * Inserts or updates a news article in Supabase with local fallback
 */
export async function saveNews(article: any, isNew = false): Promise<any> {
  const payload = toDbPayload(article);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        if (isNew) {
          const { error } = await supabase.from('news').insert([payload]);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('news').upsert(payload, { onConflict: 'id' });
          if (error) throw error;
        }
      }
    } catch (err) {
      console.error('Supabase news save error:', err);
    }
  }

  // Also maintain local/tmp cache
  const localList = await readLocalNews();
  const existingIdx = localList.findIndex((n: any) => n.id === article.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = fromDbPayload(payload);
  } else {
    localList.unshift(fromDbPayload(payload));
  }
  await writeLocalNews(localList);

  return fromDbPayload(payload);
}

/**
 * Deletes a news article from Supabase with local fallback
 */
export async function deleteNews(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Supabase news delete error:', err);
    }
  }

  const localList = await readLocalNews();
  const filtered = localList.filter((n: any) => n.id !== id);
  await writeLocalNews(filtered);

  return true;
}
