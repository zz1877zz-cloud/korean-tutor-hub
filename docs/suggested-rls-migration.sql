-- Proposal only. Do not run this until 승현 approves it.
-- Checked read-only on 2026-11-14 after project gtkzswjeycklicgnygin returned to ACTIVE_HEALTHY.
-- Nothing in this file has been applied.

-- 1. Bookings are world-readable and world-writable.
--    "Anyone can view bookings" uses true, so anon can read notes, student ids, and cancel reasons.
--    "Anyone can create booking" uses true, so a visitor can insert a booking without being the student.
--    The narrower student and tutor policies already cover signed-in use.

drop policy if exists "Anyone can view bookings" on public.bookings;
drop policy if exists "Anyone can create booking" on public.bookings;

-- 2. Anyone, including anon, can insert a tutor row.
--    Approval should stay with an admin session. This replacement keeps that path.

drop policy if exists "Anyone can insert tutors" on public.tutors;

create policy "admins insert tutors"
on public.tutors
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  )
);

-- 3. Optional, not required for the list to render.
--    "Public can view active tutors" is the right row filter (is_active = true),
--    but it also returns user_id. After the drops above, consider granting anon
--    only the public columns the tutor cards select:
--    id, bio, display_name, tagline, specialties, languages, hourly_rate,
--    rating, avatar_url, is_active.
--    Leave authenticated select in place so a tutor can still read their own user_id.
