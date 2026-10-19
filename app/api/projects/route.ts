import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import {
  getProjects,
  saveProject,
  deleteProject,
  reorderProjects,
} from '@/lib/supabaseProjects';

/**
 * Public GET: Fetches projects for both the public portfolio and Admin CRM
 */
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * Admin POST: Add a new project
 */
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to create projects.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Generate clean slug ID if not provided
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
      satelliteCategory: body.satelliteCategory || 'None',
    };

    const saved = await saveProject(newProject, true);
    return NextResponse.json({ success: true, project: saved });
  } catch (err: unknown) {
    console.error('Error adding project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create project' },
      { status: 500 }
    );
  }
}

/**
 * Admin PUT: Update an existing project or reorder projects
 */
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to update projects.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Bulk reordering
    if (body.reorder) {
      let idsToReorder: string[] = [];
      if (Array.isArray(body.projectIds)) {
        idsToReorder = body.projectIds;
      } else if (Array.isArray(body.projects)) {
        idsToReorder = body.projects.map((p: { id: string }) => p.id);
      } else {
        return NextResponse.json({ success: false, error: 'Invalid reorder data' }, { status: 400 });
      }

      const reordered = await reorderProjects(idsToReorder);
      return NextResponse.json({ success: true, projects: reordered });
    }

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const currentList = await getProjects();
    const existing = currentList.find((p) => p.id === body.id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      satelliteCategory:
        body.satelliteCategory !== undefined
          ? body.satelliteCategory
          : (existing.satelliteCategory || 'None'),
      location: body.location !== undefined ? body.location : existing.location,
      capacity: body.capacity !== undefined ? body.capacity : existing.capacity,
      client: body.client !== undefined ? body.client : existing.client,
      folder: body.folder !== undefined ? body.folder : existing.folder,
      images: Array.isArray(body.images)
        ? body.images.join(', ')
        : (body.images !== undefined ? body.images : existing.images),
      systemType: body.systemType !== undefined ? body.systemType : existing.systemType,
      completionDate: body.completionDate !== undefined ? body.completionDate : existing.completionDate,
      annualYield: body.annualYield !== undefined ? body.annualYield : existing.annualYield,
      co2Offset: body.co2Offset !== undefined ? body.co2Offset : existing.co2Offset,
      description: body.description !== undefined ? body.description : existing.description,
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : existing.highlights,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
    };

    const saved = await saveProject(updated, false);
    return NextResponse.json({ success: true, project: saved });
  } catch (err: unknown) {
    console.error('Error updating project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * Admin DELETE: Delete a project
 */
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to delete projects.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    await deleteProject(id);
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting project:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete project' },
      { status: 500 }
    );
  }
}
