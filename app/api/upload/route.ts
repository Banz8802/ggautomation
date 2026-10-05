import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
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

    // Check if we can write to public folder (local dev environment)
    let canWriteToDisk = true;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'projects', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      canWriteToDisk = false;
    }

    for (const file of files) {
      if (typeof file === 'string' || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'image/jpeg';

      if (canWriteToDisk) {
        try {
          const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const timestamp = Date.now();
          const fileName = `${timestamp}_${originalName}`;
          const filePath = path.join(uploadDir, fileName);

          await writeFile(filePath, buffer);
          uploadedUrls.push(`/images/projects/uploads/${fileName}`);
          continue;
        } catch {
          // If disk write fails at runtime, fall back to base64 data URL
          canWriteToDisk = false;
        }
      }

      // Serverless / Read-Only Environment Fallback: Base64 Data URL
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
