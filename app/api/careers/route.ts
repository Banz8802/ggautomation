import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { CareersData, initialCareersData } from '@/data/careersData';

const localFilePath = path.join(process.cwd(), 'data', 'careers.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_careers.json');

// In-memory cache for fast serverless persistence across executions
let careersMemoryCache: CareersData | null = null;

async function readCareersData(): Promise<CareersData> {
  if (careersMemoryCache && careersMemoryCache.pageSettings && Array.isArray(careersMemoryCache.jobs)) {
    return JSON.parse(JSON.stringify(careersMemoryCache));
  }

  // 1. Try reading from writable /tmp
  try {
    if (existsSync(tmpFilePath)) {
      const raw = await readFile(tmpFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pageSettings && Array.isArray(parsed.jobs)) {
        careersMemoryCache = parsed;
        return JSON.parse(JSON.stringify(parsed));
      }
    }
  } catch {}

  // 2. Fall back to bundled data file
  try {
    if (existsSync(localFilePath)) {
      const raw = await readFile(localFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      careersMemoryCache = parsed;
      return JSON.parse(JSON.stringify(parsed));
    }
  } catch (err) {
    console.error('Error reading careers.json:', err);
  }

  return JSON.parse(JSON.stringify(initialCareersData));
}

async function writeCareersData(data: CareersData) {
  careersMemoryCache = JSON.parse(JSON.stringify(data));

  // Try writing to local project directory (works in local dev)
  try {
    await writeFile(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem on serverless/production
  }

  // Always write to /tmp for serverless runtime persistence
  try {
    await writeFile(tmpFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to tmp careers file:', err);
  }
}

export async function GET() {
  try {
    const data = await readCareersData();
    return NextResponse.json({ success: true, careers: data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch careers data' },
      { status: 500 }
    );
  }
}

// POST: Add new job or save settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readCareersData();

    // If payload contains 'pageSettings', update settings
    if (body.pageSettings) {
      data.pageSettings = {
        ...data.pageSettings,
        ...body.pageSettings,
      };
      await writeCareersData(data);
      return NextResponse.json({ success: true, careers: data });
    }

    // Otherwise treat as new job position
    const slug = (body.id || body.title || `job-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newJob = {
      id: slug || `job-${Date.now()}`,
      title: body.title || 'Untitled Position',
      department: body.department || 'Operations',
      location: body.location || 'Cebu City, Philippines',
      type: body.type || 'Full-Time',
      status: (body.status === 'Closed' ? 'Closed' : 'Open') as 'Open' | 'Closed',
      experience: body.experience || 'Entry Level',
      preference: body.preference || '',
      description: body.description || '',
      requirements: Array.isArray(body.requirements) ? body.requirements.filter(Boolean) : [],
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities.filter(Boolean) : [],
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : ['Careers'],
      bannerImage: body.bannerImage !== undefined ? body.bannerImage : (body.image || ''),
    };

    data.jobs.unshift(newJob);
    await writeCareersData(data);

    return NextResponse.json({ success: true, job: newJob, careers: data });
  } catch (err: unknown) {
    console.error('Error adding job/settings:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}

// PUT: Update existing job or page settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await readCareersData();

    // If update is for pageSettings
    if (body.type === 'pageSettings' || body.pageSettings) {
      const settingsPayload = body.pageSettings || body;
      data.pageSettings = {
        ...data.pageSettings,
        badge: settingsPayload.badge !== undefined ? settingsPayload.badge : data.pageSettings.badge,
        title: settingsPayload.title !== undefined ? settingsPayload.title : data.pageSettings.title,
        subtitle: settingsPayload.subtitle !== undefined ? settingsPayload.subtitle : data.pageSettings.subtitle,
        bannerImage:
          settingsPayload.bannerImage !== undefined ? settingsPayload.bannerImage : data.pageSettings.bannerImage,
        posterImage:
          settingsPayload.posterImage !== undefined ? settingsPayload.posterImage : data.pageSettings.posterImage,
        applicationEmail:
          settingsPayload.applicationEmail !== undefined
            ? settingsPayload.applicationEmail
            : data.pageSettings.applicationEmail,
        location: settingsPayload.location !== undefined ? settingsPayload.location : data.pageSettings.location,
        headline: settingsPayload.headline !== undefined ? settingsPayload.headline : data.pageSettings.headline,
        generalRequirements: Array.isArray(settingsPayload.generalRequirements)
          ? settingsPayload.generalRequirements.filter(Boolean)
          : data.pageSettings.generalRequirements,
        applicationInstructions:
          settingsPayload.applicationInstructions !== undefined
            ? settingsPayload.applicationInstructions
            : data.pageSettings.applicationInstructions,
      };

      await writeCareersData(data);
      return NextResponse.json({ success: true, careers: data });
    }

    // Otherwise, updating a job by ID
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const index = data.jobs.findIndex((j) => j.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const existing = data.jobs[index];
    data.jobs[index] = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      department: body.department !== undefined ? body.department : existing.department,
      location: body.location !== undefined ? body.location : existing.location,
      type: body.type !== undefined ? body.type : existing.type,
      status: body.status !== undefined ? body.status : existing.status,
      experience: body.experience !== undefined ? body.experience : existing.experience,
      preference: body.preference !== undefined ? body.preference : existing.preference,
      description: body.description !== undefined ? body.description : existing.description,
      requirements: Array.isArray(body.requirements) ? body.requirements.filter(Boolean) : existing.requirements,
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.filter(Boolean)
        : existing.responsibilities,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
      bannerImage:
        body.bannerImage !== undefined
          ? body.bannerImage
          : (body.image !== undefined ? body.image : (existing.bannerImage || existing.image || '')),
    };

    await writeCareersData(data);
    return NextResponse.json({ success: true, job: data.jobs[index], careers: data });
  } catch (err: unknown) {
    console.error('Error updating careers:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update careers data' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a job by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const data = await readCareersData();
    const filtered = data.jobs.filter((j) => j.id !== id);

    if (filtered.length === data.jobs.length) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    data.jobs = filtered;
    await writeCareersData(data);
    return NextResponse.json({ success: true, message: 'Job deleted successfully', careers: data });
  } catch (err: unknown) {
    console.error('Error deleting job:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete job' },
      { status: 500 }
    );
  }
}
