-- PostgREST needs a direct FK from comments.user_id -> profiles.id
-- so queries like comments(*, profiles(display_name)) work.

alter table public.comments
  drop constraint if exists comments_user_id_fkey;

alter table public.comments
  add constraint comments_user_id_fkey
  foreign key (user_id) references public.profiles (id)
  on delete cascade;

notify pgrst, 'reload schema';
