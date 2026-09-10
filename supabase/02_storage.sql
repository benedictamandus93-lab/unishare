-- ============================================================================
--  UniShare | 02_storage.sql
--  Run this after 01_schema.sql, in Supabase Dashboard -> SQL Editor.
--  It creates the image bucket and restricts writing to each student's own
--  folder, while keeping images publicly readable so the wall renders for
--  visitors who are not logged in.
-- ============================================================================

-- 1. The bucket. Public read, 5 MB ceiling, images only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 2. Policies.
--    Every upload path begins with the student's own user id, for example
--    3f9c.../1738104000-a1b2c3.jpg. The policies compare that first folder
--    with auth.uid(), so no student can touch another student's files.

drop policy if exists "Listing images are publicly readable" on storage.objects;
create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

drop policy if exists "Students upload into their own folder" on storage.objects;
create policy "Students upload into their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students update files in their own folder" on storage.objects;
create policy "Students update files in their own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students delete files in their own folder" on storage.objects;
create policy "Students delete files in their own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
