-- Email signups for eb2niw.com.
-- The anon role may insert one row and nothing else. There is no SELECT
-- policy, so the client must not request returning rows.
-- RLS is enabled but not forced, so the table owner can read signups in the
-- Supabase dashboard. Data API roles cannot.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email),
  constraint waitlist_email_lowercase check (email = lower(email)),
  constraint waitlist_email_length check (char_length(email) between 6 and 320),
  constraint waitlist_email_shape check (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
);

comment on table public.waitlist is
  'Email addresses collected by the eb2niw.com signup form.';

alter table public.waitlist enable row level security;

revoke all on table public.waitlist from public;
revoke all on table public.waitlist from anon;
revoke all on table public.waitlist from authenticated;

grant insert on table public.waitlist to anon;
grant select, insert, update, delete on table public.waitlist to service_role;

create policy "anon_insert_waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

comment on policy "anon_insert_waitlist" on public.waitlist is
  'Insert-only access for the anon role. No select, update, or delete policy is defined.';
