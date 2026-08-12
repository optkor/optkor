-- ============================================================================
-- DEVELOPMENT / DEMO SEED DATA ONLY.
-- This is NOT production content. Do not run against a production project.
-- Intended for `supabase db reset` in local development so the UI has
-- something to render while building. Real content is entered via the
-- admin dashboard once the site is live.
-- ============================================================================

insert into public.services (title, slug, short_description, description, featured, published, sort_order) values
  ('Visual Identity', 'visual-identity', 'Systems that hold together across every surface.', 'We design and document visual identity systems built to scale across an agency''s full campaign output — not just a logo, but a usable system.', true, true, 1),
  ('Social Design & Campaigns', 'social-design-campaigns', 'Campaign-ready design at production pace.', 'Full-funnel social design, templated and original, built to match an agency''s campaign cadence without sacrificing craft.', true, true, 2),
  ('Motion Graphics', 'motion-graphics', 'Motion that clarifies, not decorates.', 'Animated identity, explainer, and campaign motion work produced to broadcast and platform-specific standards.', true, true, 3),
  ('Video Editing', 'video-editing', 'Cut for pace, story, and platform.', 'End-to-end video editing from raw footage to delivery-ready cuts across formats.', false, true, 4),
  ('Photography', 'photography', 'Production-grade image capture.', 'On-location and studio photography production, directed for brand and campaign use.', false, true, 5),
  ('Color Grading & VFX', 'color-grading-vfx', 'The final pass that makes footage feel finished.', 'Color grading and visual effects finishing for video deliverables of any scale.', false, true, 6),
  ('Production Supervision', 'production-supervision', 'One point of contact, full accountability.', 'End-to-end production oversight so an agency has a single accountable partner instead of scattered vendors.', false, true, 7),
  ('Brand Guidelines', 'brand-guidelines', 'Documentation that protects the work.', 'Comprehensive brand guideline systems that keep execution consistent long after delivery.', false, true, 8)
on conflict (slug) do nothing;

insert into public.projects (title, slug, client, category, short_description, description, year, featured, published, sort_order) values
  ('Northline Rebrand Campaign', 'northline-rebrand-campaign', 'Northline Agency', 'Visual Identity', 'A full identity system built for a multi-market rollout.', 'A ground-up visual identity and campaign system produced for Northline''s retail client, delivered across print, motion, and social formats on a compressed production timeline.', 2025, true, true, 1),
  ('Aurora Product Launch', 'aurora-product-launch', 'Aurora Collective', 'Motion Graphics', 'Motion-first launch content for a consumer tech client.', 'Motion graphics and social campaign assets produced for a coordinated product launch across five markets.', 2025, true, true, 2),
  ('Meridian Social System', 'meridian-social-system', 'Meridian Studio', 'Social Design & Campaigns', 'A modular social system built for weekly campaign turnaround.', 'A templated, on-brand social design system built to let Meridian''s internal team turn around campaign content weekly without OPTKOR in the loop for every asset.', 2024, false, true, 3)
on conflict (slug) do nothing;
