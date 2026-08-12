-- anon-scoped RLS policies never call is_admin(), so anon does not need EXECUTE.
revoke execute on function public.is_admin() from anon;

-- Pin search_path to close the mutable-search-path lint.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
