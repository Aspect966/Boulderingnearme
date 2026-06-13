-- Owner role and elevated permissions
-- Run in Supabase Dashboard → SQL Editor (after 001_initial_schema.sql)

alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'owner'));

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

-- Owners can update any profile display name (optional admin helper)
create policy "Owners can update any profile"
  on public.profiles for update
  using (public.is_owner());

-- Boulder management
drop policy if exists "Creators can update own boulders" on public.boulders;
create policy "Creators or owners can update boulders"
  on public.boulders for update
  using (auth.uid() = created_by or public.is_owner());

create policy "Creators or owners can delete boulders"
  on public.boulders for delete
  using (auth.uid() = created_by or public.is_owner());

-- Photo management
create policy "Owners can delete any photo"
  on public.boulder_photos for delete
  using (auth.uid() = user_id or public.is_owner());

-- Comment management
create policy "Owners can delete any comment"
  on public.comments for delete
  using (auth.uid() = user_id or public.is_owner());

-- Rating management
create policy "Owners can delete any rating"
  on public.difficulty_ratings for delete
  using (auth.uid() = user_id or public.is_owner());

-- Grant owner to Lukas H (run after the user account exists)
update public.profiles
set role = 'owner', display_name = 'Lukas H'
where id = (
  select id from auth.users where email = 'pineappleboi564585@gmail.com'
);

-- If profile row is missing, create it
insert into public.profiles (id, display_name, role)
select id, 'Lukas H', 'owner'
from auth.users
where email = 'pineappleboi564585@gmail.com'
on conflict (id) do update
set role = 'owner', display_name = 'Lukas H';
