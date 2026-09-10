# UniShare

A digital wall magazine for University of Auckland students. Students pin things
they want to sell, rent out or offer as a service, and other students browse,
search and then contact the poster directly through email, WhatsApp or a text
message. UniShare deliberately stops at that point. There is no cart, no
checkout, no internal chat and no delivery.

The whole experience is **post, discover, contact**.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and
Supabase, and ready to deploy on Vercel.

---

## 1. What is in the repository

```
unishare/
├── app/
│   ├── layout.tsx                      Shared shell, fonts, navigation, footer
│   ├── page.tsx                        Homepage and the full wall
│   ├── globals.css                     Design tokens and component classes
│   ├── buy/page.tsx                    Wall pre-filtered to Buy
│   ├── rent/page.tsx                   Wall pre-filtered to Rent
│   ├── services/page.tsx               Wall pre-filtered to Services
│   ├── listing/[id]/page.tsx           Listing detail and contact buttons
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── auth/verify/page.tsx            "Check your inbox" screen
│   ├── auth/callback/route.ts          Completes email confirmation
│   ├── post/page.tsx                   Create a listing, sign in required
│   ├── account/page.tsx                Welcome screen
│   ├── account/listings/page.tsx       My listings, with edit and delete
│   ├── account/listings/[id]/edit/     Edit one of your own listings
│   └── not-found.tsx
├── components/
│   ├── AuthProvider.tsx                Session state shared across the app
│   ├── Navbar.tsx                      Responsive navigation
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx              All / Buy / Rent / Services
│   ├── ServiceFilter.tsx               Service subcategories
│   ├── ListingCard.tsx                 A pinned flyer
│   ├── ListingGrid.tsx
│   ├── ListingWall.tsx                 Search and both filters working together
│   ├── ContactButtons.tsx              Email, WhatsApp and SMS links
│   ├── PostListingForm.tsx             Create and edit, including image upload
│   ├── AuthForm.tsx                    Register and log in
│   ├── DeleteListingButton.tsx
│   ├── PosterArt.tsx                   Uploaded photo, or a drawn poster
│   ├── EmptyState.tsx
│   ├── SetupNotice.tsx                 Shown only before Supabase is connected
│   └── Footer.tsx
├── lib/
│   ├── types.ts                        Listing and Profile types
│   ├── constants.ts                    Categories, subcategories, domains
│   ├── utils.ts                        Validation, prices, contact links
│   ├── listings.ts                     Server side queries
│   └── supabase/{client,server,middleware}.ts
├── supabase/
│   ├── 01_schema.sql                   Tables, indexes, triggers, RLS
│   ├── 02_storage.sql                  Image bucket and storage policies
│   └── 03_seed.sql                     Thirteen fictional sample listings
├── middleware.ts                       Session refresh and route protection
├── .env.example
└── README.md
```

---

## 2. Running it on your own machine

```bash
npm install
cp .env.example .env.local     # then paste your two Supabase values in
npm run dev                    # http://localhost:3000
```

Two commands are useful before you submit or deploy:

```bash
npm run typecheck              # TypeScript, no errors expected
npm run build                  # production build, no errors expected
```

---

## 3. Setting up Supabase

Create a free project at https://supabase.com, then work through the following
in order.

### 3.1 Database schema

Open **SQL Editor** in the left sidebar, choose **New query**, paste the whole
of `supabase/01_schema.sql`, and press **Run**.

That single script creates:

* the `profiles` table, keyed to Supabase's own `auth.users` table
* the `listings` table, with a foreign key back to `profiles`
* check constraints, so a service always has a subcategory and every listing
  carries at least one contact method
* five indexes covering the section tabs, the account page and full text search
* the trigger that rejects any registration outside the two university domains
* the trigger that creates a profile row automatically after registration
* the trigger that keeps `updated_at` accurate
* Row Level Security policies for both tables

### 3.2 Image storage

Still in **SQL Editor**, run `supabase/02_storage.sql`. It creates the
`listing-images` bucket and the four storage policies. Every file is uploaded
into a folder named after the student's own user id, and the policies compare
that folder against `auth.uid()`, so one student can never overwrite or delete
another student's images. You can confirm the bucket afterwards under
**Storage** in the sidebar.

### 3.3 Sample listings

Run `supabase/03_seed.sql` last. It adds thirteen fictional listings so that the
deployed site never looks empty. Every name, email address and phone number in
that file is invented. These rows have no owner, which means no logged in
student can edit or delete them.

### 3.4 Authentication settings

Go to **Authentication → Sign In / Providers** and confirm that **Email** is
enabled with **Confirm email** turned on. This is the default for new projects.

Then go to **Authentication → URL Configuration** and set:

* **Site URL**: your Vercel address, for example `https://unishare.vercel.app`
* **Redirect URLs**: add both of these
  * `https://your-project.vercel.app/auth/callback`
  * `http://localhost:3000/auth/callback`

Without the second entry, confirmation links will not work while you develop
locally.

### 3.5 Email verification

Supabase sends the confirmation email for you using its built in service. That
service is rate limited to a small number of messages per hour, which is fine
for an assignment demonstration. If you need higher volume, add your own SMTP
details under **Project Settings → Authentication → SMTP Settings**.

The default confirmation template already points at `{{ .SiteURL }}`, and the
route at `app/auth/callback/route.ts` accepts both link formats Supabase uses,
so no template editing is required.

---

## 4. Deploying to Vercel

1. Push this folder to a new GitHub repository. Do not commit `.env.local`; it
   is already listed in `.gitignore`.
2. At https://vercel.com choose **Add New → Project**, then **Import** your
   GitHub repository. Vercel detects Next.js automatically, so the build command
   and output directory need no changes.
3. Before the first deployment, open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → anon / publishable key |

   Apply both to Production, Preview and Development.
4. Press **Deploy**. If you added the variables after deploying, open
   **Deployments**, then the three dot menu on the newest one, and choose
   **Redeploy**.
5. Copy your live address back into Supabase under **Authentication → URL
   Configuration**, as described in section 3.4.

The anon key is designed to be visible in the browser. Row Level Security is
what protects the data. The service role key is never used anywhere in this
project and must never be added to the repository or to a `NEXT_PUBLIC_`
variable.

---

## 5. How the important requirements are met

**University email restriction.** The check happens twice. `isUniversityEmail`
in `lib/utils.ts` gives immediate feedback in the browser, and the
`enforce_university_email` trigger in `01_schema.sql` runs inside PostgreSQL
before any row reaches `auth.users`. Because the trigger sits in the database
rather than in the application, it still applies if somebody calls the Supabase
API directly or edits the frontend code.

**Search.** The search box matches against the title, the description, the
category name, the service type and the poster's name. Multiple words are
treated as separate terms, so "graduation makeup" only returns listings that
contain both. Search runs in the browser over the listings already loaded, which
means results appear as you type with no page reload. A GIN full text index is
also present in the schema, which is the query you would move to if the wall
grew past a few thousand listings.

**Filters working with search.** `ListingWall.tsx` holds the category, the
service subcategory and the search text in one piece of state and applies all
three in a single pass. Choosing Services, then Photography, then typing
"graduation" narrows the wall to graduation photography only.

**Contact.** No account holds a phone number or an email by default. The poster
ticks the methods they want on the posting form, and only the ticked fields are
shown. The detail page builds a `mailto:` link, a `https://wa.me/` link and an
`sms:` link, each pre-filled with a short message. UniShare hands the
conversation to whichever app the student already has. It cannot detect which
apps are installed and it does not claim to.

**Ownership.** Editing and deleting are restricted by Row Level Security using
`auth.uid() = user_id`, so the database refuses the write regardless of what the
interface allows. The interface hides the controls as well, but that is
convenience rather than the security boundary.

**Images.** Supabase Storage is used rather than plain URLs, because a URL field
would let a student paste a link to any image anywhere and would give no control
over file size or type. The bucket restricts uploads to images under 5 MB.
Listings without a photo are not left blank; `PosterArt.tsx` draws a poster in
the section colour with a motif chosen from words in the title, which keeps the
wall looking intentional.

---

## 6. Known limitations

* Supabase's built in email service has a low hourly limit. For a live
  demonstration, register your test account beforehand.
* Search and filtering run in the browser over the full set of listings. That is
  the right choice for a community sized noticeboard and it keeps the interface
  instant, but a production version at a much larger scale would move the query
  to the database using the `listings_search_idx` index that is already defined.
* The seeded listings intentionally have no owner, so they cannot be edited from
  the account area. Post your own listing to demonstrate editing and deleting.
