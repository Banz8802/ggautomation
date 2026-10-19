-- ==============================================================================
-- GG AUTOMATION: SUPABASE DATABASE & STORAGE INITIALIZATION SCRIPT
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Commercial',
  location TEXT DEFAULT '',
  capacity TEXT DEFAULT '',
  client TEXT DEFAULT '',
  folder TEXT DEFAULT '',
  images TEXT DEFAULT '',
  system_type TEXT DEFAULT '',
  completion_date TEXT DEFAULT '',
  annual_yield TEXT DEFAULT '',
  co2_offset TEXT DEFAULT '',
  description TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  satellite_category TEXT DEFAULT 'None',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Projects Table Security Policies
-- Allow anyone (public & website visitors) to view projects
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
CREATE POLICY "Public projects are viewable by everyone" 
ON public.projects FOR SELECT 
USING (true);

-- Allow authenticated users / service role to insert projects
DROP POLICY IF EXISTS "Authorized users can insert projects" ON public.projects;
CREATE POLICY "Authorized users can insert projects" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users / service role to update projects
DROP POLICY IF EXISTS "Authorized users can update projects" ON public.projects;
CREATE POLICY "Authorized users can update projects" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users / service role to delete projects
DROP POLICY IF EXISTS "Authorized users can delete projects" ON public.projects;
CREATE POLICY "Authorized users can delete projects" 
ON public.projects FOR DELETE 
TO authenticated 
USING (true);

-- 4. Create the dedicated Supabase Storage bucket for project media
-- Allows WebP, PNG, JPG/JPEG, MP4, WebM, and MOV up to 50MB
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  true,
  52428800, -- 50MB in bytes
  ARRAY[
    'image/webp',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/mov',
    'video/x-m4v'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/webp',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/mov',
    'video/x-m4v'
  ];

-- 5. Storage Bucket Security Policies
-- Allow anyone to view/read project photos & videos
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-media');

-- Allow authenticated users / service role to upload media
DROP POLICY IF EXISTS "Authorized media upload access" ON storage.objects;
CREATE POLICY "Authorized media upload access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'project-media');

-- Allow authenticated users / service role to update media
DROP POLICY IF EXISTS "Authorized media update access" ON storage.objects;
CREATE POLICY "Authorized media update access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'project-media');

-- Allow authenticated users / service role to delete media
DROP POLICY IF EXISTS "Authorized media delete access" ON storage.objects;
CREATE POLICY "Authorized media delete access" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'project-media');
