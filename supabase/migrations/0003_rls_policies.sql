alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.services enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- projects
create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

create policy "Admins can read all projects"
  on public.projects for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- project_media
create policy "Public can read media of published projects"
  on public.project_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.published = true
    )
  );

create policy "Admins can read all media"
  on public.project_media for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert media"
  on public.project_media for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update media"
  on public.project_media for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete media"
  on public.project_media for delete
  to authenticated
  using (public.is_admin());

-- services
create policy "Public can read published services"
  on public.services for select
  to anon, authenticated
  using (published = true);

create policy "Admins can read all services"
  on public.services for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert services"
  on public.services for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update services"
  on public.services for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete services"
  on public.services for delete
  to authenticated
  using (public.is_admin());

-- contact_messages: public may only insert, never read/update/delete
create policy "Public can submit contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete messages"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- site_settings: public read, admin write
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Admins can update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
