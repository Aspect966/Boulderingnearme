-- Run this in Supabase Dashboard -> SQL Editor if migrations were not applied yet.
-- Fixes: missing is_thumbnail column + missing boulder-photos storage bucket.

alter table public.boulder_photos
  add column if not exists is_thumbnail boolean not null default false;

create unique index if not exists boulder_photos_one_thumbnail_idx
  on public.boulder_photos (boulder_id)
  where is_thumbnail = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'boulder-photos',
  'boulder-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read boulder photos" on storage.objects;
drop policy if exists "Authenticated upload boulder photos" on storage.objects;
drop policy if exists "Users delete own boulder photos" on storage.objects;

create policy "Public read boulder photos"
  on storage.objects for select
  using (bucket_id = 'boulder-photos');

create policy "Authenticated upload boulder photos"
  on storage.objects for insert
  with check (
    bucket_id = 'boulder-photos'
    and auth.role() = 'authenticated'
  );

create policy "Users delete own boulder photos"
  on storage.objects for delete
  using (
    bucket_id = 'boulder-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

notify pgrst, 'reload schema';
