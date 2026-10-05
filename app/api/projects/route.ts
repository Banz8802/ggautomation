import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const localFilePath = path.join(process.cwd(), 'data', 'projects.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_projects.json');

// In-memory cache for fast serverless persistence across executions in the same instance
let projectsMemoryCache: unknown[] | null = null;

async function readProjectsData(): Promise<any[]> {
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

async function writeProjectsData(data: unknown[]) {
  projectsMemoryCache = [...data];

  // Try writing to local project directory (works in local dev)
  try {
    await writeFile(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem on Vercel / Lambda - expected
  }

  // Always write to /tmp for serverless runtime persistence
  try {
    await writeFile(tmpFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to tmp projects file:', err);
  }
}

export async function GET() {
  try {
    const projects = await readProjectsData();
    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const projects = await readProjectsData();

    // Generate unique slug id if not provided
    const slug = (body.id || body.title || `project-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProject = {
      id: slug || `project-${Date.now()}`,
      title: body.title || 'Untitled Project',
      category: body.category || 'Commercial',
      location: body.location || 'Philippines',
      capacity: body.capacity || 'Custom kWp',
      client: body.client || 'Valued Client',
      folder: body.folder || '',
      images: Array.isArray(body.images) ? body.images.join(', ') : (body.images || ''),
      systemType: body.systemType || `${body.category || 'Solar'} PV System`,
      completionDate: body.completionDate || 'Completed & Fully Operational',
      annualYield: body.annualYield || '',
      co2Offset: body.co2Offset || '',
      description: body.description || '',
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : [],
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [body.category || 'Solar'],
    };

    // Prepend to list so newest project appears first
    projects.unshift(newProject);
    await writeProjectsData(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: unknown) {
    console.error('Error adding project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const projects = await readProjectsData();
    const index = projects.findIndex((p: { id: string }) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const existing = projects[index];
    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      location: body.location !== undefined ? body.location : existing.location,
      capacity: body.capacity !== undefined ? body.capacity : existing.capacity,
      client: body.client !== undefined ? body.client : existing.client,
      folder: body.folder !== undefined ? body.folder : existing.folder,
      images: Array.isArray(body.images) ? body.images.join(', ') : (body.images !== undefined ? body.images : existing.images),
      systemType: body.systemType !== undefined ? body.systemType : existing.systemType,
      completionDate: body.completionDate !== undefined ? body.completionDate : existing.completionDate,
      annualYield: body.annualYield !== undefined ? body.annualYield : existing.annualYield,
      co2Offset: body.co2Offset !== undefined ? body.co2Offset : existing.co2Offset,
      description: body.description !== undefined ? body.description : existing.description,
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : existing.highlights,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
    };

    projects[index] = updated;
    await writeProjectsData(projects);

    return NextResponse.json({ success: true, project: updated });
  } catch (err: unknown) {
    console.error('Error updating project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const projects = await readProjectsData();
    const filtered = projects.filter((p: { id: string }) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    await writeProjectsData(filtered);
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete project' },
      { status: 500 }
    );
  }
}
