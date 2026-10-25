-- Fit-check answers from the home page and /start.
-- The anon role may insert one row and nothing else. There is no SELECT
-- policy, so the client must not request returning rows.
-- RLS is enabled but not forced, so the table owner can read rows in the
-- Supabase dashboard. Data API roles cannot.

create table public.intake (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  marketing_consent boolean not null,
  pathway text not null,
  degree text not null,
  years_experience text not null,
  compensation text not null,
  role_level text not null,
  profile_signals text[] not null,
  current_status text[] not null,
  writing_comfort text not null,
  plan_suggestion text not null,
  created_at timestamptz not null default now(),
  constraint intake_first_name_length check (char_length(first_name) between 1 and 80),
  constraint intake_last_name_length check (char_length(last_name) between 1 and 80),
  constraint intake_email_lowercase check (email = lower(email)),
  constraint intake_email_length check (char_length(email) between 6 and 320),
  constraint intake_email_shape check (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint intake_phone check (
    phone is null
    or (
      char_length(phone) between 7 and 40
      and phone ~ '^[0-9+(). -]+$'
    )
  ),
  constraint intake_pathway check (pathway in ('niw', 'not_sure')),
  constraint intake_degree check (degree in ('bachelor', 'master', 'phd', 'other')),
  constraint intake_years_experience check (
    years_experience in ('under_5', 'five_to_ten', 'ten_to_fifteen', 'fifteen_plus')
  ),
  constraint intake_compensation check (
    compensation in ('under_80', '80_120', '120_200', '200_plus')
  ),
  constraint intake_role_level check (
    role_level in ('entry', 'mid', 'senior', 'principal')
  ),
  constraint intake_profile_signals_size check (
    cardinality(profile_signals) between 1 and 11
  ),
  constraint intake_profile_signals_items check (
    profile_signals <@ array[
      'critical_role',
      'high_salary',
      'original',
      'authorship',
      'media',
      'judging',
      'awards',
      'memberships',
      'commercial',
      'presentations',
      'none'
    ]::text[]
  ),
  constraint intake_profile_signals_none check (
    not ('none' = any (profile_signals))
    or cardinality(profile_signals) = 1
  ),
  constraint intake_current_status_size check (
    cardinality(current_status) between 1 and 7
  ),
  constraint intake_current_status_items check (
    current_status <@ array[
      'f1',
      'h1b',
      'opt',
      'i485',
      'prior_denial',
      'outside_us',
      'other'
    ]::text[]
  ),
  constraint intake_writing_comfort check (
    writing_comfort in ('confident', 'guidance', 'lawyer_check')
  ),
  constraint intake_plan_suggestion check (
    plan_suggestion in ('diy', 'attorney_review', 'stretch')
  )
);

comment on table public.intake is
  'Fit-check answers, the plan suggestion shown before contact details, and the name and email collected on the result screen.';

alter table public.intake enable row level security;

revoke all on table public.intake from public;
revoke all on table public.intake from anon;
revoke all on table public.intake from authenticated;

grant insert on table public.intake to anon;
grant select, insert, update, delete on table public.intake to service_role;

create policy "anon_insert_intake"
  on public.intake
  for insert
  to anon
  with check (true);

comment on policy "anon_insert_intake" on public.intake is
  'Insert-only access for the anon role. No select, update, or delete policy is defined.';
