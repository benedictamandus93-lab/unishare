-- ============================================================================
--  UniShare | 04_wanted_migration.sql
--  Adds the "Wanted" side of the wall.
--
--  Run this in Supabase Dashboard -> SQL Editor AFTER 01_schema.sql.
--  Safe to run more than once. No existing data is lost: every listing that
--  already exists becomes an "offering" listing, which is what it was.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. THE DIRECTION COLUMN
--    Direction and category answer two different questions. Direction asks who
--    holds the item; category asks how it changes hands. Keeping them in
--    separate columns avoids a combined list such as "wanted to rent", which
--    would double every time a new category were added.
-- ---------------------------------------------------------------------------
alter table public.listings
  add column if not exists direction text not null default 'offering';

-- Constraint added separately so that re-running the script does not fail.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'listings_direction_check'
  ) then
    alter table public.listings
      add constraint listings_direction_check
      check (direction in ('offering', 'wanted'));
  end if;
end $$;

comment on column public.listings.direction is
  'offering = the student has the item. wanted = the student is looking for it.';

-- ---------------------------------------------------------------------------
-- 2. INDEXES
--    Almost every query now filters on direction first, so the existing
--    category indexes are extended rather than duplicated.
-- ---------------------------------------------------------------------------
create index if not exists listings_direction_idx
  on public.listings (direction);

create index if not exists listings_direction_category_idx
  on public.listings (direction, category);

-- ---------------------------------------------------------------------------
-- 3. SAMPLE WANTED LISTINGS
--    All names and contact details are fictional. user_id is null, so
--    auth.uid() = user_id is never true and no student can edit or delete them.
--
--    On a wanted listing the price column holds the student's budget. The
--    application labels it "Budget up to $40" rather than as an asking price.
-- ---------------------------------------------------------------------------
delete from public.listings where user_id is null and direction = 'wanted';

insert into public.listings
  (user_id, poster_name, direction, category, subcategory, title, description,
   price, price_unit, email_contact, whatsapp_contact, sms_contact, created_at)
values
(null, 'Hana', 'wanted', 'buy', null,
 'Looking for a second-hand desk lamp',
 'I have just moved into a flat with very dim overhead lighting and I need something for studying at night. Any working condition is fine as long as the switch is reliable. I can collect from anywhere near the city campus and pay cash on pickup.',
 25, 'fixed', 'hana.demo@aucklanduni.ac.nz', null, null, now() - interval '1 day'),

(null, 'Oliver', 'wanted', 'buy', null,
 'Wanted: ENGGEN 731 course textbook',
 'Looking for the set text for Agile and Lean Project Management this semester. Highlighting is not a problem. Happy to meet on campus between lectures.',
 45, 'fixed', 'oliver.demo@aucklanduni.ac.nz', '6421000201', null, now() - interval '2 days'),

(null, 'Grace', 'wanted', 'buy', null,
 'Looking for a small bookshelf or shelving unit',
 'Moving into a studio and running out of floor space. Anything up to about a metre tall would work. I can borrow a car for collection at the weekend.',
 40, 'fixed', null, '6421000202', '0210000202', now() - interval '3 days'),

(null, 'Nikhil', 'wanted', 'rent', null,
 'Need a projector for one evening',
 'Our society is running a film night in a booked room and the venue does not supply a projector. I only need it for a single evening and I will collect and return it the same day.',
 20, 'day', 'nikhil.demo@aucklanduni.ac.nz', null, null, now() - interval '2 days'),

(null, 'Amelia', 'wanted', 'rent', null,
 'Looking to borrow a tripod for a film paper',
 'I have a camera but no tripod, and I need steady shots for an assignment due in two weeks. Any standard tripod would be fine. Happy to pay a daily rate and leave a deposit.',
 10, 'day', null, '6421000203', null, now() - interval '4 days'),

(null, 'Tane', 'wanted', 'services', 'tutoring',
 'Looking for a calculus tutor before the test',
 'I am struggling with integration techniques and the test is in three weeks. Looking for someone who has already passed the paper and can work through past questions with me, once or twice a week.',
 25, 'hour', 'tane.demo@aucklanduni.ac.nz', '6421000204', null, now() - interval '1 day'),

(null, 'Sophie', 'wanted', 'services', 'moving-help',
 'Need two people to help move a flat on Saturday',
 'Moving from a second-floor flat in Grafton to a ground-floor one in Mount Eden. I have a van booked, so I mainly need help with lifting and stairs. Should take about three hours.',
 20, 'hour', null, '6421000205', '0210000205', now() - interval '5 days'),

(null, 'Marcus', 'wanted', 'services', 'design',
 'Looking for someone to design a society poster',
 'Our club needs a poster for an event in three weeks, printed and for social media. Nothing elaborate, but it needs to look tidy. I can supply the text and the photos.',
 30, 'from', 'marcus.demo@aucklanduni.ac.nz', null, null, now() - interval '6 days');
