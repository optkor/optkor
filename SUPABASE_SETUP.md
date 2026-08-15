# Supabase Setup — OPTKOR

This project already has a linked Supabase project (`OptkorProject`, ref `wmprherzmtndsggxrbze`) with all migrations applied. Use this guide either to verify that setup or to stand up a **fresh** Supabase project from scratch (e.g. for a new environment).

## 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project (or use the existing `OptkorProject`).
2. Choose a region close to your users and set a strong database password.
3. Wait for the project to finish provisioning (status: `ACTIVE_HEALTHY`).

## 2. Get your project URL and keys

In **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ server-only, never expose to the browser)

## 3. Configure `.env.local`

Copy the example file and fill in the values from step 2:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-or-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` is gitignored — never commit it.

## 4. Run the migrations

The schema lives in `supabase/migrations/`, applied in filename order. Two ways to apply them:

**Option A — Supabase CLI (recommended for a fresh project):**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

**Option B — SQL Editor:** open each file in `supabase/migrations/` in numeric order and run it in the Supabase Dashboard's SQL Editor.

This creates: `admin_users`, `projects`, `project_media`, `services`, `contact_messages`, `site_settings`, the `is_admin()` helper function, all indexes/triggers, and every Row Level Security policy. RLS is enabled on every table — public users can only read published content and submit contact messages; all writes require admin auth.

## 5. Create the admin account

Admin access is **not** a hardcoded password — it's a real Supabase Auth user whose ID is registered in the `admin_users` table.

1. In the Supabase Dashboard, go to **Authentication → Users → Add user** (or **Invite user** to send a magic email). Create the first admin with an email/password.
2. Copy the new user's UUID.
3. In the SQL Editor, run:

```sql
insert into public.admin_users (user_id) values ('<the-user-uuid>');
```

That user can now sign in at `/admin/login`. This is the **only** time you need to touch the database or dashboard directly for admin accounts — from here on, use **Admin → Admin Users** in the app itself to create additional admins, reset passwords (including your own, from **Admin → Settings**), or disable/delete accounts. That page requires `SUPABASE_SERVICE_ROLE_KEY` to be set, since managing other users' accounts goes through the Supabase Auth Admin API rather than RLS.

## 6. Configure Storage

The `project-media` bucket and its policies are created by `supabase/migrations/0004_storage.sql` — nothing further to do if you ran the migrations. It is:

- **Public read** — anyone can view files (needed for the public site).
- **Admin-only write** — insert/update/delete require the `is_admin()` check, i.e. an authenticated admin session.
- 50MB file size limit, restricted to common image/video MIME types.

Files are organized as `projects/{project-id}/cover/*` and `projects/{project-id}/gallery/*`.

## 7. Storage policies (if setting up manually)

If you're not using the migration files, apply the storage bucket + 4 policies from `supabase/migrations/0004_storage.sql` manually via the SQL Editor. Do not make the bucket public-write — only public-read.

## 8. Seed development data (optional)

`supabase/seed.sql` contains clearly-marked **development/demo** content (sample services and projects) for local UI development. It is never applied automatically. To use it locally:

```bash
npx supabase db reset
```

(This re-runs migrations + seed against your **local** Supabase stack — never run `db reset` against production.) Never load `seed.sql` into a production project.

## 9. Run the application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the admin dashboard.

## 10. Verify the database connection

Visit `http://localhost:3000/api/health` (or `curl` it). It checks — without ever exposing secrets — that:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
- The database is reachable.
- All required tables (`projects`, `project_media`, `services`, `contact_messages`, `site_settings`) exist and are queryable.

A healthy response looks like:

```json
{ "ok": true, "env": { "...": true }, "database": { "reachable": true, "tables": { "...": true } } }
```

## 11. Regenerating types after a schema change

Whenever you add a migration, regenerate `lib/supabase/types.ts`:

```bash
npx supabase gen types typescript --project-id <project-ref> > lib/supabase/types.ts
```

Then re-add the domain-friendly aliases at the bottom of the file (`Project`, `Service`, etc. — see the existing file for the pattern).
