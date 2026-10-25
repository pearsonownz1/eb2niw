-- Accounts, chosen plan, eligibility answers, and uploaded documents.
-- Authenticated users can read and insert only their own rows.
-- Plan rows can be inserted only as pending_payment. Nothing in this
-- migration marks a plan paid. Apply after the earlier waitlist and intake
-- migrations. The intake table stays an anonymous fit-check log.

create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  constraint profiles_email_length check (email is null or char_length(email) between 6 and 320),
  constraint profiles_full_name_length check (full_name is null or char_length(full_name) between 1 and 160)
);

comment on table public.profiles is
  'One profile per auth user, created when the auth user is created.';

create table public.plan_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null,
  status text not null,
  stripe_price_id text,
  created_at timestamptz not null default now(),
  constraint plan_selections_plan check (plan in ('diy', 'attorney_review')),
  constraint plan_selections_status check (status in ('pending_payment', 'active', 'canceled')),
  constraint plan_selections_stripe_price_id check (
    stripe_price_id is null or char_length(stripe_price_id) between 3 and 120
  )
);

comment on table public.plan_selections is
  'The plan a user chose. New rows from the app are pending_payment until a payment provider marks them active.';

create index plan_selections_user_created_idx
  on public.plan_selections (user_id, created_at desc);

create table public.eligibility_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
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
  constraint eligibility_pathway check (pathway in ('niw', 'not_sure')),
  constraint eligibility_degree check (degree in ('bachelor', 'master', 'phd', 'other')),
  constraint eligibility_years check (
    years_experience in ('under_5', 'five_to_ten', 'ten_to_fifteen', 'fifteen_plus')
  ),
  constraint eligibility_compensation check (
    compensation in ('under_80', '80_120', '120_200', '200_plus')
  ),
  constraint eligibility_role check (role_level in ('entry', 'mid', 'senior', 'principal')),
  constraint eligibility_signals_size check (cardinality(profile_signals) between 1 and 11),
  constraint eligibility_signals_items check (
    profile_signals <@ array[
      'critical_role', 'high_salary', 'original', 'authorship', 'media', 'judging',
      'awards', 'memberships', 'commercial', 'presentations', 'none'
    ]::text[]
  ),
  constraint eligibility_signals_none check (
    not ('none' = any (profile_signals)) or cardinality(profile_signals) = 1
  ),
  constraint eligibility_status_size check (cardinality(current_status) between 1 and 7),
  constraint eligibility_status_items check (
    current_status <@ array[
      'f1', 'h1b', 'opt', 'i485', 'prior_denial', 'outside_us', 'other'
    ]::text[]
  ),
  constraint eligibility_writing check (
    writing_comfort in ('confident', 'guidance', 'lawyer_check')
  ),
  constraint eligibility_plan_suggestion check (
    plan_suggestion in ('diy', 'attorney_review', 'stretch')
  )
);

comment on table public.eligibility_responses is
  'Eligibility questionnaire answers saved for the signed-in user. The plan suggestion is a product recommendation, not an eligibility finding.';

create index eligibility_responses_user_created_idx
  on public.eligibility_responses (user_id, created_at desc);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  created_at timestamptz not null default now(),
  constraint documents_storage_path_length check (char_length(storage_path) between 3 and 500),
  constraint documents_file_name_length check (char_length(file_name) between 1 and 180),
  constraint documents_storage_path_unique unique (storage_path)
);

comment on table public.documents is
  'Files a user uploaded for their own petition workspace.';

create index documents_user_created_idx
  on public.documents (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.plan_selections enable row level security;
alter table public.eligibility_responses enable row level security;
alter table public.documents enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.plan_selections from public, anon, authenticated;
revoke all on table public.eligibility_responses from public, anon, authenticated;
revoke all on table public.documents from public, anon, authenticated;

grant select on table public.profiles to authenticated;
grant select, insert on table public.plan_selections to authenticated;
grant select, insert on table public.eligibility_responses to authenticated;
grant select, insert on table public.documents to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.plan_selections to service_role;
grant select, insert, update, delete on table public.eligibility_responses to service_role;
grant select, insert, update, delete on table public.documents to service_role;

create policy "select_own_profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "select_own_plan"
  on public.plan_selections for select to authenticated
  using (user_id = (select auth.uid()));

create policy "insert_own_pending_plan"
  on public.plan_selections for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending_payment'
  );

create policy "select_own_eligibility"
  on public.eligibility_responses for select to authenticated
  using (user_id = (select auth.uid()));

create policy "insert_own_eligibility"
  on public.eligibility_responses for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "select_own_documents"
  on public.documents for select to authenticated
  using (user_id = (select auth.uid()));

create policy "insert_own_documents"
  on public.documents for insert to authenticated
  with check (user_id = (select auth.uid()));

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit)
values ('petition-documents', 'petition-documents', false, 10485760)
on conflict (id) do update
  set public = false,
      file_size_limit = 10485760;

create policy "read_own_petition_documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'petition-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "insert_own_petition_documents"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'petition-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
