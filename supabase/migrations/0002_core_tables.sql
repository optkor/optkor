-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  client text,
  category text,
  description text,
  short_description text,
  year integer check (year is null or (year between 1990 and 2100)),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (published);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- project_media
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  url text not null check (char_length(url) > 0),
  alt text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_media_project_id_idx on public.project_media (project_id);
create index if not exists project_media_sort_order_idx on public.project_media (project_id, sort_order);

-- services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  short_description text,
  icon text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_published_idx on public.services (published);
create index if not exists services_sort_order_idx on public.services (sort_order);

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- contact_messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company text,
  phone text,
  subject text,
  message text not null check (char_length(message) > 0),
  project_type text,
  budget_range text,
  timeline text,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- site_settings (singleton row)
create table if not exists public.site_settings (
  id boolean primary key default true,
  company_name text not null default 'OPTKOR',
  tagline text,
  contact_email text,
  contact_phone text,
  address text,
  social_links jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  og_image text,
  homepage_config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id, company_name, tagline, contact_email, seo_title, seo_description)
values (
  true,
  'OPTKOR',
  'From the core, to the vision.',
  'hello@optkor.com',
  'OPTKOR — Visual Production Company',
  'OPTKOR is a B2B visual production partner for marketing agencies and brands, turning strategy into precise, premium visual production.'
)
on conflict (id) do nothing;
