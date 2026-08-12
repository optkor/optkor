-- Consolidate overlapping SELECT policies flagged by the performance advisor.
-- Previously "Public can read published X" targeted {anon, authenticated} and
-- "Admins can read all X" also targeted {authenticated}, so every authenticated
-- SELECT evaluated two permissive policies. Scope the public policy to anon
-- only, and fold the published-OR-admin condition into a single authenticated
-- policy per table.

-- projects
drop policy "Public can read published projects" on public.projects;
drop policy "Admins can read all projects" on public.projects;

create policy "Anon can read published projects"
  on public.projects for select
  to anon
  using (published = true);

create policy "Authenticated can read published or admin projects"
  on public.projects for select
  to authenticated
  using (published = true or public.is_admin());

-- project_media
drop policy "Public can read media of published projects" on public.project_media;
drop policy "Admins can read all media" on public.project_media;

create policy "Anon can read media of published projects"
  on public.project_media for select
  to anon
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.published = true
    )
  );

create policy "Authenticated can read media of published or admin projects"
  on public.project_media for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.published = true
    )
  );

-- services
drop policy "Public can read published services" on public.services;
drop policy "Admins can read all services" on public.services;

create policy "Anon can read published services"
  on public.services for select
  to anon
  using (published = true);

create policy "Authenticated can read published or admin services"
  on public.services for select
  to authenticated
  using (published = true or public.is_admin());
