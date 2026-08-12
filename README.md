# OPTKOR

Production website and admin dashboard for OPTKOR — a B2B visual production company. Built as a single full-stack system: Next.js App Router on top of a real Supabase backend (Postgres, Auth, Storage) from the first line of code, not a static frontend with mock data.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** for styling, **Framer Motion** for motion
- **Supabase**: Postgres (with Row Level Security), Auth, Storage
- **Zod** for server-side validation

## Project structure

```
app/
  (site)/            public marketing site — home, work, services, about, contact
  admin/
    login/           admin sign-in (public route)
    (protected)/     dashboard, projects, services, messages, settings — auth-gated
  api/health/         secret-free Supabase connectivity check
  sitemap.ts, robots.ts
components/
  ui/                design system primitives (Button, FormField, Modal, Toast, states…)
  layout/            Navbar, Footer, LanguageSwitcher
  work/, services/, contact/, home/, admin/
lib/
  supabase/          client.ts (browser), server.ts (SSR), admin.ts (service-role), middleware.ts, types.ts
  queries/           read-only Supabase queries, one file per domain
  mutations/         "use server" Server Actions — all writes go through these
  validations/       Zod schemas
  i18n/               en/ar dictionaries + locale helpers
supabase/
  migrations/         ordered SQL migrations (schema, RLS, storage)
  seed.sql            dev-only demo content, never applied to production
```

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials — see SUPABASE_SETUP.md
npm run dev
```

Full Supabase provisioning steps (project creation, migrations, admin account, storage) are in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run lint          # ESLint
npm run typecheck    # tsc --noEmit
```

## Architecture notes

- **Every table has RLS enabled.** Public users can read published content and insert contact messages; every other write requires an authenticated admin (checked via a `SECURITY DEFINER` `is_admin()` function keyed off an `admin_users` table — not a hardcoded role or client-side check).
- **Admin routes are guarded twice**: once in `middleware.ts` (redirects unauthenticated/non-admin users before the page renders) and again in `app/admin/(protected)/layout.tsx` (re-verifies server-side, since middleware alone is not a security boundary to rely on).
- **Media uploads** go to a Supabase Storage bucket (`project-media`), validated for MIME type and size before upload; failed uploads never leave an orphaned DB record, and failed DB writes clean up the uploaded file.
- **i18n**: UI chrome (nav, footer, forms, section labels) is fully localized for English and Arabic via `lib/i18n`, with RTL layout switching on the `<html dir>` attribute. Long-form admin-entered content (project descriptions, etc.) is single-language by design — extending it to per-locale columns is a natural follow-up if needed.
- **No mock data.** Every list/detail page reads from Supabase; empty and error states are real, not placeholders.

## Deployment

Any Next.js host works (Vercel, etc.). Set the same environment variables from `.env.local` in your hosting provider, pointing `NEXT_PUBLIC_SITE_URL` at the production domain.
