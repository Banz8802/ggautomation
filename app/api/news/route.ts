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
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article Title is required.' },
        { status: 400 }
      );
    }

    const news = await readNewsData();

    // Generate unique slug
    let baseSlug = (body.id?.trim() || body.title.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = `news-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (news.some((n: { id: string }) => n.id === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const parsedContent = Array.isArray(body.fullContent)
      ? body.fullContent.filter(Boolean)
      : typeof body.fullContent === 'string' && body.fullContent.trim()
      ? [body.fullContent.trim()]
      : [];

    const summary = (body.summary || '').trim() || (parsedContent[0] || body.title);

    const newArticle = {
      id: uniqueSlug,
      title: body.title.trim(),
      category: body.category || 'Scholarship',
      date: body.date || new Date().toISOString().split('T')[0],
      formattedDate: body.formattedDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      authorOrHost: (body.authorOrHost || 'GG Automation Team').trim(),
      location: (body.location || 'Cebu City, Philippines').trim(),
      image: (body.image || '/images/hero-solar-engineering.webp').trim(),
      summary,
      fullContent: parsedContent.length > 0 ? parsedContent : [summary],
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : [],
      contactInfo: {
        phone: body.contactInfo?.phone || '',
        email: body.contactInfo?.email || '',
        facebookUrl: body.contactInfo?.facebookUrl || '',
      },
      tags: Array.isArray(body.tags) && body.tags.filter(Boolean).length > 0
        ? body.tags.filter(Boolean)
        : [body.category || 'News'],
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
    const targetId = body.originalId || body.id;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const news = await readNewsData();
    const index = news.findIndex((n: { id: string }) => n.id === targetId);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const existing = news[index];
    const parsedContent = body.fullContent !== undefined
      ? (Array.isArray(body.fullContent) ? body.fullContent.filter(Boolean) : [body.fullContent].filter(Boolean))
      : existing.fullContent;

    const summary = body.summary !== undefined ? body.summary.trim() : existing.summary;

    const updated = {
      ...existing,
      id: body.id && body.id.trim() ? body.id.trim() : existing.id,
      title: body.title !== undefined ? body.title.trim() : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      date: body.date !== undefined ? body.date : existing.date,
      formattedDate: body.formattedDate !== undefined ? body.formattedDate : existing.formattedDate,
      authorOrHost: body.authorOrHost !== undefined ? body.authorOrHost.trim() : existing.authorOrHost,
      location: body.location !== undefined ? body.location.trim() : existing.location,
      image: body.image !== undefined ? body.image.trim() : existing.image,
      summary: summary || existing.summary,
      fullContent: parsedContent,
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : existing.highlights,
      contactInfo: {
        phone: body.contactInfo?.phone !== undefined ? body.contactInfo.phone : existing.contactInfo?.phone || '',
        email: body.contactInfo?.email !== undefined ? body.contactInfo.email : existing.contactInfo?.email || '',
        facebookUrl: body.contactInfo?.facebookUrl !== undefined ? body.contactInfo.facebookUrl : existing.contactInfo?.facebookUrl || '',
      },
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
