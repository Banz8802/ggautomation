import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAdminSession } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { uploadBufferToSupabaseStorage } from '@/lib/supabaseProjects';

// 50MB file size limit for photos & short portfolio videos
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/mov',
  'video/x-m4v',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
]);

export async function POST(request: Request) {
  try {
    // 1. Strict Server-Side Admin Authorization
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required to upload media.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const supabaseReady = isSupabaseConfigured();

    // Check if local disk is writable (local dev environment)
    let canWriteToDisk = !supabaseReady;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'projects', 'uploads');

    if (canWriteToDisk) {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch {
        canWriteToDisk = false;
      }
    }

    for (const file of files) {
      if (typeof file === 'string' || !file.name) continue;

      // 2. Validate File Size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds the 50MB maximum size limit.`,
          },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).toLowerCase();
      const mimeType = file.type || 'application/octet-stream';

      // 3. Validate MIME type & Extension
      if (!ALLOWED_MIME_TYPES.has(mimeType) && !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `File type not supported for "${file.name}". Supported formats: WebP, PNG, JPG, MP4, WebM, MOV.`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

      // 4. Primary: Supabase Storage (Persistent, CDN-backed, portable across any host)
      if (supabaseReady) {
        try {
          const publicUrl = await uploadBufferToSupabaseStorage(buffer, cleanOriginalName, mimeType);
          uploadedUrls.push(publicUrl);
          continue;
        } catch (supabaseErr) {
          console.error('Supabase Storage upload error, checking fallback:', supabaseErr);
        }
      }

      // 5. Local Dev Environment: Write to public folder
      if (canWriteToDisk) {
        try {
          const fileName = `${Date.now()}_${cleanOriginalName}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          uploadedUrls.push(`/images/projects/uploads/${fileName}`);
          continue;
        } catch {
          canWriteToDisk = false;
        }
      }

      // 6. Safe Serverless Fallback (Base64 data URL)
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      uploadedUrls.push(dataUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || null,
    });
  } catch (err: unknown) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
