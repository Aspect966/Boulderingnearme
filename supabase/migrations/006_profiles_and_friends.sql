-- Extended profiles, friendships, and profile asset storage
-- Run in Supabase Dashboard → SQL Editor (after previous migrations)

-- Profile fields for social pages
alter table public.profiles
  add column if not exists bio text check (bio is null or char_length(bio) <= 500),
  add column if not exists avatar_path text,
  add column if not exists background_path text,
  add column if not exists location text check (location is null or char_length(location) <= 120),
  add column if not exists website text check (website is null or char_length(website) <= 200);

-- Friendships (request → accept model)
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
create index if not exists friendships_status_idx on public.friendships (status);

alter table public.friendships enable row level security;

-- Users can see friendships they participate in, plus accepted friendships on any profile
create policy "Users can view relevant friendships"
  on public.friendships for select
  using (
    auth.uid() = requester_id
    or auth.uid() = addressee_id
    or status = 'accepted'
  );

create policy "Users can send friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id and status = 'pending');

create policy "Addressees can accept requests"
  on public.friendships for update
  using (auth.uid() = addressee_id and status = 'pending')
  with check (status = 'accepted');

create policy "Participants can remove friendships"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Storage bucket for profile avatars and cover images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-assets',
  'profile-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

create policy "Public read profile assets"
  on storage.objects for select
  using (bucket_id = 'profile-assets');

create policy "Users upload own profile assets"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-assets'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users update own profile assets"
  on storage.objects for update
  using (
    bucket_id = 'profile-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users delete own profile assets"
  on storage.objects for delete
  using (
    bucket_id = 'profile-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
