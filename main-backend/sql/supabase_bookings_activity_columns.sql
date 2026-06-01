-- Run in Supabase SQL Editor if bookings API fails with "schema cache" or missing column errors.
-- Adjust types if your project already differs.

alter table public.bookings
  add column if not exists activity_id integer,
  add column if not exists activity_name text,
  add column if not exists group_size text,
  add column if not exists package_type text;

-- Reload PostgREST schema cache (fixes stale cache after migrations)
notify pgrst, 'reload schema';
