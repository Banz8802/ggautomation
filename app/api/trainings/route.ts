import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'trainings.json');

async function readTrainingsData() {
  try {
    const raw = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading trainings.json:', err);
    return [];
  }
}

async function writeTrainingsData(data: unknown[]) {
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const trainings = await readTrainingsData();
    return NextResponse.json({ success: true, trainings });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch trainings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trainings = await readTrainingsData();

    // Generate unique slug id if not provided
    const slug = (body.id || body.title || `training-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newTraining = {
      id: slug || `training-${Date.now()}`,
      title: body.title || 'Untitled Training / Workshop',
      category: body.category || 'Specialized Track',
      badge: body.badge || body.category || 'Specialized Track',
      date: body.date || 'Scheduled Batches',
      location: body.location || 'Cebu / Laguna, Philippines',
      organizer: body.organizer || 'GG Automation Construction Services',
      videoUrl: body.videoUrl || '',
      image: body.image || '/images/hero-floating-solar.jpg',
      gallery: Array.isArray(body.gallery) ? body.gallery.join(', ') : (body.gallery || body.image || ''),
      description: body.description || '',
      topics: Array.isArray(body.topics) ? body.topics.filter(Boolean) : [],
      targetAudience: body.targetAudience || 'Engineers, Developers & Technicians',
      registrationUrl: body.registrationUrl || '/contact',
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [body.category || 'Training'],
    };

    // Prepend to list so newest training appears first
    trainings.unshift(newTraining);
    await writeTrainingsData(trainings);

    return NextResponse.json({ success: true, training: newTraining });
  } catch (err: unknown) {
    console.error('Error adding training:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create training' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Training ID is required' }, { status: 400 });
    }

    const trainings = await readTrainingsData();
    const index = trainings.findIndex((t: { id: string }) => t.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Training not found' }, { status: 404 });
    }

    const existing = trainings[index];
    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      badge: body.badge !== undefined ? body.badge : existing.badge,
      date: body.date !== undefined ? body.date : existing.date,
      location: body.location !== undefined ? body.location : existing.location,
      organizer: body.organizer !== undefined ? body.organizer : existing.organizer,
      videoUrl: body.videoUrl !== undefined ? body.videoUrl : existing.videoUrl,
      image: body.image !== undefined ? body.image : existing.image,
      gallery: Array.isArray(body.gallery)
        ? body.gallery.join(', ')
        : (body.gallery !== undefined ? body.gallery : existing.gallery),
      description: body.description !== undefined ? body.description : existing.description,
      topics: Array.isArray(body.topics) ? body.topics.filter(Boolean) : existing.topics,
      targetAudience: body.targetAudience !== undefined ? body.targetAudience : existing.targetAudience,
      registrationUrl: body.registrationUrl !== undefined ? body.registrationUrl : existing.registrationUrl,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
    };

    trainings[index] = updated;
    await writeTrainingsData(trainings);

    return NextResponse.json({ success: true, training: updated });
  } catch (err: unknown) {
    console.error('Error updating training:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update training' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Training ID is required' }, { status: 400 });
    }

    const trainings = await readTrainingsData();
    const filtered = trainings.filter((t: { id: string }) => t.id !== id);

    if (filtered.length === trainings.length) {
      return NextResponse.json({ success: false, error: 'Training not found' }, { status: 404 });
    }

    await writeTrainingsData(filtered);
    return NextResponse.json({ success: true, message: 'Training deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting training:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete training' },
      { status: 500 }
    );
  }
}
