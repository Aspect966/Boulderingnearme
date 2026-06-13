# BoulderingNearMe

Discover outdoor boulders near you. Add problems, upload photos, rate difficulty on multiple scales, and build community consensus grades.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Supabase (Auth, Database, Storage)
- Vercel (deployment)

## Setup

### 1. Run the database migrations

Open **Supabase Dashboard → SQL Editor** and run these files in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_owner_role.sql`
3. `supabase/migrations/003_photo_thumbnail.sql`
4. `supabase/migrations/004_boulder_photos_bucket_and_thumbnail.sql`
5. `supabase/migrations/005_comments_profiles_fkey.sql`
6. `supabase/migrations/006_profiles_and_friends.sql`

For local dev, disable email confirmation under **Authentication → Settings → Confirm email** so users can sign up and use the app immediately without verifying their inbox.

If photo uploads fail with a missing `is_thumbnail` column or storage bucket error, you can also run the one-shot fix:

`supabase/setup-boulder-photos.sql`

That adds the thumbnail column, creates the public `boulder-photos` storage bucket (5 MB image limit), and reloads the Supabase schema cache.

### 2. Enable email auth

In Supabase: **Authentication → Providers → Email** (enabled by default).

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and publishable key.

For **Cursor MCP** (optional but recommended), also add a Personal Access Token:

```env
SUPABASE_ACCESS_TOKEN=sbp_your_token_here
```

See `.cursor/SUPABASE_MCP.md` for full MCP setup.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Near me** — geolocation sorting for nearby boulders
- **Add boulders** — name, description, GPS, location label
- **Photos** — upload to Supabase Storage
- **Multi-scale grades** — V-Scale (default), Font, British, Japanese, YDS
- **Consensus grading** — IQR outlier removal, whole-number averages
- **Comments** — community beta and conditions
- **Profiles** — custom avatars, cover images, bio, location, and website
- **Friends** — send requests, accept/decline, and view friend lists on profiles

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
