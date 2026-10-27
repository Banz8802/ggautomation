import { NextResponse } from 'next/server';
import { getNews, saveNews, deleteNews } from '@/lib/supabaseNews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(
      { success: true, news },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
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

    const news = await getNews();

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

    const cleanDates = Array.isArray(body.displayDates)
      ? body.displayDates.map((d: any) => String(d).trim()).filter(Boolean)
      : [];
    const formattedDate = cleanDates.length > 0
      ? cleanDates.join(', ')
      : (body.formattedDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    const cleanLocations = Array.isArray(body.locations)
      ? body.locations.map((l: any) => String(l).trim()).filter(Boolean)
      : [];
    const location = cleanLocations.length > 0
      ? cleanLocations.join(' | ')
      : (body.location || 'Cebu City, Philippines').trim();

    let cleanImages: string[] = [];
    if (Array.isArray(body.images)) {
      cleanImages = body.images.filter((img: unknown) => typeof img === 'string' && img.trim().length > 0);
    } else if (typeof body.images === 'string' && body.images.trim()) {
      cleanImages = body.images.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
    }
    if (cleanImages.length === 0 && body.image && typeof body.image === 'string' && body.image.trim()) {
      cleanImages = [body.image.trim()];
    }

    const primaryImage = cleanImages[0] || (body.image || '/images/hero-solar-engineering.webp').trim();

    const newArticle = {
      id: uniqueSlug,
      title: body.title.trim(),
      category: body.category || 'Scholarship',
      date: body.date || new Date().toISOString().split('T')[0],
      formattedDate,
      displayDates: cleanDates.length > 0 ? cleanDates : [formattedDate],
      authorOrHost: (body.authorOrHost || 'GG Automation Team').trim(),
      location,
      locations: cleanLocations.length > 0 ? cleanLocations : [location],
      image: primaryImage,
      images: cleanImages.length > 0 ? cleanImages : [primaryImage],
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
      isUpcomingEvent: Boolean(body.isUpcomingEvent),
      isPastEvent: Boolean(body.isPastEvent),
    };

    const savedArticle = await saveNews(newArticle, true);
    return NextResponse.json({ success: true, article: savedArticle });
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

    const news = await getNews();
    const existing = news.find((n: { id: string }) => n.id === targetId);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const parsedContent = body.fullContent !== undefined
      ? (Array.isArray(body.fullContent) ? body.fullContent.filter(Boolean) : [body.fullContent].filter(Boolean))
      : existing.fullContent;

    const summary = body.summary !== undefined ? body.summary.trim() : existing.summary;

    const cleanDates = body.displayDates !== undefined
      ? (Array.isArray(body.displayDates) ? body.displayDates.map((d: any) => String(d).trim()).filter(Boolean) : [])
      : existing.displayDates;
    const formattedDate = cleanDates && cleanDates.length > 0
      ? cleanDates.join(', ')
      : (body.formattedDate !== undefined ? body.formattedDate : existing.formattedDate);

    const cleanLocations = body.locations !== undefined
      ? (Array.isArray(body.locations) ? body.locations.map((l: any) => String(l).trim()).filter(Boolean) : [])
      : existing.locations;
    const location = cleanLocations && cleanLocations.length > 0
      ? cleanLocations.join(' | ')
      : (body.location !== undefined ? body.location.trim() : existing.location);

    let cleanImages: string[] | undefined = undefined;
    if (Array.isArray(body.images)) {
      cleanImages = body.images.filter((img: unknown) => typeof img === 'string' && img.trim().length > 0);
    } else if (typeof body.images === 'string' && body.images.trim()) {
      cleanImages = body.images.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
    }

    const nextImages = cleanImages && cleanImages.length > 0
      ? cleanImages
      : (body.image ? [body.image.trim()] : (existing.images || (existing.image ? [existing.image] : [])));

    const nextPrimaryImage = cleanImages && cleanImages.length > 0
      ? cleanImages[0]
      : (body.image !== undefined ? body.image.trim() : (existing.image || nextImages[0] || ''));

    const updated = {
      ...existing,
      id: body.id && body.id.trim() ? body.id.trim() : existing.id,
      title: body.title !== undefined ? body.title.trim() : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      date: body.date !== undefined ? body.date : existing.date,
      formattedDate,
      displayDates: cleanDates && cleanDates.length > 0 ? cleanDates : [formattedDate],
      authorOrHost: body.authorOrHost !== undefined ? body.authorOrHost.trim() : existing.authorOrHost,
      location,
      locations: cleanLocations && cleanLocations.length > 0 ? cleanLocations : [location],
      image: nextPrimaryImage,
      images: nextImages,
      summary: summary || existing.summary,
      fullContent: parsedContent,
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : existing.highlights,
      contactInfo: {
        phone: body.contactInfo?.phone !== undefined ? body.contactInfo.phone : existing.contactInfo?.phone || '',
        email: body.contactInfo?.email !== undefined ? body.contactInfo.email : existing.contactInfo?.email || '',
        facebookUrl: body.contactInfo?.facebookUrl !== undefined ? body.contactInfo.facebookUrl : existing.contactInfo?.facebookUrl || '',
      },
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
      isUpcomingEvent: body.isUpcomingEvent !== undefined ? Boolean(body.isUpcomingEvent) : Boolean(existing.isUpcomingEvent),
      isPastEvent: body.isPastEvent !== undefined ? Boolean(body.isPastEvent) : Boolean(existing.isPastEvent),
    };

    // If ID changed, delete the old ID
    if (body.id && body.id.trim() !== targetId) {
      await deleteNews(targetId);
    }

    const savedArticle = await saveNews(updated, false);
    return NextResponse.json({ success: true, article: savedArticle });
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

    await deleteNews(id);
    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting news:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete news' },
      { status: 500 }
    );
  }
}
