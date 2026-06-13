-- Allow owners and boulder creators to remove listing photos from storage
-- Run in Supabase Dashboard → SQL Editor (after 002_owner_role.sql)

create policy "Owners can delete any boulder photo storage"
  on storage.objects for delete
  using (
    bucket_id = 'boulder-photos'
    and public.is_owner()
  );

create policy "Boulder creators can delete listing photo storage"
  on storage.objects for delete
  using (
    bucket_id = 'boulder-photos'
    and exists (
      select 1
      from public.boulders b
      where b.id = ((storage.foldername(name))[2])::uuid
        and b.created_by = auth.uid()
    )
  );
