-- Storage bucket for project media (covers + galleries).
-- Path convention: projects/{project-id}/cover/*  and  projects/{project-id}/gallery/*
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  52428800, -- 50MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read project media files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-media');

create policy "Admins can upload project media files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-media' and public.is_admin());

create policy "Admins can update project media files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-media' and public.is_admin())
  with check (bucket_id = 'project-media' and public.is_admin());

create policy "Admins can delete project media files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-media' and public.is_admin());
