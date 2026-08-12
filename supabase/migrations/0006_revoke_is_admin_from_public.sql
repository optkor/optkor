-- PostgreSQL grants EXECUTE to PUBLIC by default; anon inherits from PUBLIC.
-- Revoking from PUBLIC (not just anon) is required to actually remove anon's access.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
