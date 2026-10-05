import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const localFilePath = path.join(process.cwd(), 'data', 'news.json');
const tmpFilePath = path.join(os.tmpdir(), 'ggautomation_news.json');

// In-memory cache for fast serverless persistence across executions in the same instance
let newsMemoryCache: unknown[] | null = null;

async function readNewsData(): Promise<any[]> {
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
    const raw = await readFile(localFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    newsMemoryCache = parsed;
    return [...parsed];
  } catch (err) {
    console.error('Error reading news.json:', err);
    return [];
  }
}

async function writeNewsData(data: unknown[]) {
  newsMemoryCache = [...data];

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
    console.error('Error writing to tmp news file:', err);
  }
}

export async function GET() {
  try {
    const news = await readNewsData();
    return NextResponse.json({ success: true, news });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = await readNewsData();

    const slug = (body.id || body.title || `news-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newArticle = {
      id: slug || `news-${Date.now()}`,
      title: body.title || 'Untitled Update',
      category: body.category || 'Technical Seminar',
      date: body.date || new Date().toISOString().split('T')[0],
      formattedDate: body.formattedDate || 'Recent Update',
      authorOrHost: body.authorOrHost || 'GG Automation Team',
      location: body.location || 'Philippines',
      image: body.image || '/images/hero-solar-engineering.webp',
      summary: body.summary || '',
      fullContent: Array.isArray(body.fullContent) ? body.fullContent.filter(Boolean) : [body.summary || ''],
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : [],
      contactInfo: body.contactInfo || undefined,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : ['News'],
    };

    news.unshift(newArticle);
    await writeNewsData(news);

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: unknown) {
    console.error('Error adding news:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create news' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const news = await readNewsData();
    const index = news.findIndex((n: { id: string }) => n.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const existing = news[index];
    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      date: body.date !== undefined ? body.date : existing.date,
      formattedDate: body.formattedDate !== undefined ? body.formattedDate : existing.formattedDate,
      authorOrHost: body.authorOrHost !== undefined ? body.authorOrHost : existing.authorOrHost,
      location: body.location !== undefined ? body.location : existing.location,
      image: body.image !== undefined ? body.image : existing.image,
      summary: body.summary !== undefined ? body.summary : existing.summary,
      fullContent: Array.isArray(body.fullContent) ? body.fullContent.filter(Boolean) : existing.fullContent,
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : existing.highlights,
      contactInfo: body.contactInfo !== undefined ? body.contactInfo : existing.contactInfo,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
    };

    news[index] = updated;
    await writeNewsData(news);

    return NextResponse.json({ success: true, article: updated });
  } catch (err: unknown) {
    console.error('Error updating news:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const news = await readNewsData();
    const filtered = news.filter((n: { id: string }) => n.id !== id);

    if (filtered.length === news.length) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    await writeNewsData(filtered);
    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting news:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete news' },
      { status: 500 }
    );
  }
}
