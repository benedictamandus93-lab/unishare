-- ============================================================================
--  UniShare | 01_schema.sql
--  Paste this whole file into Supabase Dashboard -> SQL Editor -> New query
--  and press Run. It is safe to run more than once.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
--    One row per registered student, linked to Supabase's auth.users table.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  name             text not null check (char_length(trim(name)) between 2 and 80),
  university_email text not null unique,
  created_at       timestamptz not null default now()
);

comment on table public.profiles is
  'Student accounts. Created automatically when a user registers.';

-- ---------------------------------------------------------------------------
-- 2. LISTINGS
--    user_id is nullable so that the demonstration data in 03_seed.sql can
--    exist without an owner. A null owner can never satisfy auth.uid() = user_id,
--    so nobody is able to edit or delete the sample listings.
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles (id) on delete cascade,
  poster_name      text not null,
  category         text not null check (category in ('buy', 'rent', 'services')),
  subcategory      text check (
                     subcategory in (
                       'photography', 'makeup-beauty', 'tutoring', 'repairs',
                       'design', 'moving-help', 'cleaning', 'other'
                     )
                   ),
  title            text not null check (char_length(trim(title)) between 1 and 90),
  description      text not null check (char_length(trim(description)) between 10 and 900),
  price            numeric(10, 2) not null check (price >= 0),
  price_unit       text not null default 'fixed'
                     check (price_unit in ('fixed', 'hour', 'day', 'from')),
  image_url        text,
  email_contact    text,
  whatsapp_contact text,
  sms_contact      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- A service must say what kind of service it is, and only a service may.
  constraint listings_subcategory_matches_category check (
    (category = 'services' and subcategory is not null)
    or (category <> 'services' and subcategory is null)
  ),

  -- Every listing must carry at least one way of getting in touch.
  constraint listings_needs_one_contact check (
    coalesce(email_contact, '') <> ''
    or coalesce(whatsapp_contact, '') <> ''
    or coalesce(sms_contact, '') <> ''
  )
);

comment on table public.listings is
  'Everything pinned to the UniShare wall.';

-- ---------------------------------------------------------------------------
-- 3. INDEXES
--    The first three support the section tabs and the account page. The last
--    one is a full text index over the fields the search box looks at.
-- ---------------------------------------------------------------------------
create index if not exists listings_category_idx
  on public.listings (category);

create index if not exists listings_category_subcategory_idx
  on public.listings (category, subcategory);

create index if not exists listings_user_id_idx
  on public.listings (user_id);

create index if not exists listings_created_at_idx
  on public.listings (created_at desc);

create index if not exists listings_search_idx
  on public.listings
  using gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '') || ' ' ||
      coalesce(subcategory, '')
    )
  );

-- ---------------------------------------------------------------------------
-- 4. SERVER SIDE UNIVERSITY EMAIL RULE
--    This is the authoritative check. It runs inside the database, so it
--    cannot be bypassed by editing the frontend or calling the API directly.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_university_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null
     or lower(new.email) !~ '^[^@[:space:]]+@(auckland\.ac\.nz|aucklanduni\.ac\.nz)$'
  then
    raise exception
      'Please use a University of Auckland email address ending in @auckland.ac.nz or @aucklanduni.ac.nz.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_university_email_trigger on auth.users;
create trigger enforce_university_email_trigger
  before insert on auth.users
  for each row execute function public.enforce_university_email();

-- ---------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION
--    Runs after the email rule has passed, so only university accounts exist.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, university_email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    lower(new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6. KEEP updated_at HONEST
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_touch_updated_at on public.listings;
create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Profiles ------------------------------------------------------------------
drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Students insert their own profile" on public.profiles;
create policy "Students insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Students update their own profile" on public.profiles;
create policy "Students update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Listings ------------------------------------------------------------------
drop policy if exists "Anyone can read listings" on public.listings;
create policy "Anyone can read listings"
  on public.listings for select
  using (true);

drop policy if exists "Signed in students create their own listings" on public.listings;
create policy "Signed in students create their own listings"
  on public.listings for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Students update only their own listings" on public.listings;
create policy "Students update only their own listings"
  on public.listings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Students delete only their own listings" on public.listings;
create policy "Students delete only their own listings"
  on public.listings for delete
  to authenticated
  using (auth.uid() = user_id);
