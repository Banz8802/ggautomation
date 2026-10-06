import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { HomeCategoryItem, initialHomeCategories } from '@/data/homeCategoriesData';

const localFilePath = path.join(process.cwd(), 'data', 'homeCategories.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_homeCategories.json');

// In-memory cache for fast serverless persistence
let homeCategoriesMemoryCache: HomeCategoryItem[] | null = null;

async function readHomeCategoriesData(): Promise<HomeCategoryItem[]> {
  if (homeCategoriesMemoryCache && Array.isArray(homeCategoriesMemoryCache) && homeCategoriesMemoryCache.length > 0) {
    return JSON.parse(JSON.stringify(homeCategoriesMemoryCache));
  }

  // 1. Try reading from writable /tmp
  try {
    if (existsSync(tmpFilePath)) {
      const raw = await readFile(tmpFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        homeCategoriesMemoryCache = parsed;
        return JSON.parse(JSON.stringify(parsed));
      }
    }
  } catch {}

  // 2. Fall back to bundled data file
  try {
    if (existsSync(localFilePath)) {
      const raw = await readFile(localFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        homeCategoriesMemoryCache = parsed;
        return JSON.parse(JSON.stringify(parsed));
      }
    }
  } catch (err) {
    console.error('Error reading homeCategories.json:', err);
  }

  return JSON.parse(JSON.stringify(initialHomeCategories));
}

async function writeHomeCategoriesData(data: HomeCategoryItem[]) {
  homeCategoriesMemoryCache = JSON.parse(JSON.stringify(data));

  // Try writing to local project directory (local dev)
  try {
    await writeFile(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem on serverless
  }

  // Always write to /tmp for serverless runtime persistence
  try {
    await writeFile(tmpFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to tmp homeCategories file:', err);
  }
}

// GET: Fetch all home categories
export async function GET() {
  try {
    const categories = await readHomeCategoriesData();
    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// PUT: Update single or all categories
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const categories = await readHomeCategoriesData();

    if (Array.isArray(body)) {
      // Bulk update all categories
      await writeHomeCategoriesData(body);
      return NextResponse.json({ success: true, categories: body });
    } else if (body && body.id) {
      // Single category update
      const index = categories.findIndex((c) => c.id === body.id);
      if (index !== -1) {
        categories[index] = {
          ...categories[index],
          ...body,
        };
      } else {
        categories.push(body);
      }
      await writeHomeCategoriesData(categories);
      return NextResponse.json({ success: true, category: body, categories });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to save categories' },
      { status: 500 }
    );
  }
}

// POST: Reset or replace categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      await writeHomeCategoriesData(body);
      return NextResponse.json({ success: true, categories: body });
    }
    const categories = await readHomeCategoriesData();
    categories.push(body);
    await writeHomeCategoriesData(categories);
    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}
