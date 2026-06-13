alter table public.boulder_photos
  add column if not exists is_thumbnail boolean not null default false;

create unique index if not exists boulder_photos_one_thumbnail_idx
  on public.boulder_photos (boulder_id)
  where is_thumbnail = true;
