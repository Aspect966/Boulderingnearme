-- Run this in Supabase Dashboard → SQL Editor

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'owner')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Boulders
create table if not exists public.boulders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  location_label text not null,
  primary_scale text not null default 'v_scale',
  consensus_v_grade integer,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists boulders_location_idx on public.boulders (latitude, longitude);

alter table public.boulders enable row level security;

create policy "Boulders are viewable by everyone"
  on public.boulders for select using (true);

create policy "Authenticated users can create boulders"
  on public.boulders for insert with check (auth.uid() = created_by);

create policy "Creators can update own boulders"
  on public.boulders for update using (auth.uid() = created_by);

-- Photos
create table if not exists public.boulder_photos (
  id uuid primary key default gen_random_uuid(),
  boulder_id uuid not null references public.boulders (id) on delete cascade,
  storage_path text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.boulder_photos enable row level security;

create policy "Photos are viewable by everyone"
  on public.boulder_photos for select using (true);

create policy "Authenticated users can upload photos"
  on public.boulder_photos for insert with check (auth.uid() = user_id);

create policy "Users can delete own photos"
  on public.boulder_photos for delete using (auth.uid() = user_id);

-- Difficulty ratings
create table if not exists public.difficulty_ratings (
  id uuid primary key default gen_random_uuid(),
  boulder_id uuid not null references public.boulders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  scale text not null,
  grade_label text not null,
  v_equivalent integer not null,
  created_at timestamptz not null default now(),
  unique (boulder_id, user_id)
);

alter table public.difficulty_ratings enable row level security;

create policy "Ratings are viewable by everyone"
  on public.difficulty_ratings for select using (true);

create policy "Authenticated users can rate"
  on public.difficulty_ratings for insert with check (auth.uid() = user_id);

create policy "Users can update own rating"
  on public.difficulty_ratings for update using (auth.uid() = user_id);

create policy "Users can delete own rating"
  on public.difficulty_ratings for delete using (auth.uid() = user_id);

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  boulder_id uuid not null references public.boulders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Recalculate consensus grade (IQR outlier removal, whole number result)
create or replace function public.recalculate_consensus_grade(target_boulder_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  grades integer[];
  filtered integer[];
  q1 numeric;
  q3 numeric;
  iqr numeric;
  avg_grade numeric;
begin
  select array_agg(v_equivalent order by v_equivalent)
  into grades
  from public.difficulty_ratings
  where boulder_id = target_boulder_id;

  if grades is null or array_length(grades, 1) is null then
    update public.boulders
    set consensus_v_grade = null, updated_at = now()
    where id = target_boulder_id;
    return;
  end if;

  if array_length(grades, 1) = 1 then
    update public.boulders
    set consensus_v_grade = grades[1], updated_at = now()
    where id = target_boulder_id;
    return;
  end if;

  if array_length(grades, 1) = 2 then
    update public.boulders
    set consensus_v_grade = round((grades[1] + grades[2]) / 2.0)::integer,
      updated_at = now()
    where id = target_boulder_id;
    return;
  end if;

  q1 := percentile_cont(0.25) within group (order by v_equivalent)
    from public.difficulty_ratings where boulder_id = target_boulder_id;
  q3 := percentile_cont(0.75) within group (order by v_equivalent)
    from public.difficulty_ratings where boulder_id = target_boulder_id;
  iqr := q3 - q1;

  select array_agg(v_equivalent)
  into filtered
  from public.difficulty_ratings
  where boulder_id = target_boulder_id
    and v_equivalent >= (q1 - 1.5 * iqr)
    and v_equivalent <= (q3 + 1.5 * iqr);

  if filtered is null or array_length(filtered, 1) is null then
    filtered := grades;
  end if;

  select avg(v)::numeric into avg_grade from unnest(filtered) as t(v);

  update public.boulders
  set consensus_v_grade = round(avg_grade)::integer, updated_at = now()
  where id = target_boulder_id;
end;
$$;

create or replace function public.on_rating_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recalculate_consensus_grade(
    coalesce(new.boulder_id, old.boulder_id)
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists difficulty_ratings_consensus on public.difficulty_ratings;
create trigger difficulty_ratings_consensus
  after insert or update or delete on public.difficulty_ratings
  for each row execute function public.on_rating_change();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for boulder photos
insert into storage.buckets (id, name, public)
values ('boulder-photos', 'boulder-photos', true)
on conflict (id) do nothing;

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
