-- Fit-check submissions, Book now clicks, and admin read access.
-- Anon and signed-in visitors may insert a submission or a click and nothing else.
-- There is no select policy for them, so the client must not request returning rows.
-- Admins read through policies that call private.is_admin(). The service role
-- key is not used by the app. Apply after the EB-2 answer migration.

alter table public.profiles
  add column is_admin boolean not null default false;

comment on column public.profiles.is_admin is
  'Allows /admin. Profiles have no update grant, so a signed-in user cannot set this.';

-- New auth users get a profile from private.handle_new_user(). Existing auth
-- users do not, so create the missing rows before granting admin.
insert into public.profiles (id, email)
select u.id,
       case
         when u.email is null or char_length(u.email) between 6 and 320 then u.email
         else null
       end
from auth.users as u
where not exists (
  select 1
  from public.profiles as p
  where p.id = u.id
);

update public.profiles
set is_admin = true
where id = '2ae16e07-9e15-4f54-924f-0997a8f2a239'
   or lower(email) = 'guy@gcs.org';

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.is_admin
      from public.profiles as p
      where p.id = (select auth.uid())
    ),
    false
  );
$$;

comment on function private.is_admin() is
  'True when the signed-in user profile has is_admin. Security definer so row level security can call it without recursing.';

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

create policy "admin_select_profiles"
  on public.profiles
  for select
  to authenticated
  using ((select private.is_admin()));

create policy "admin_select_plans"
  on public.plan_selections
  for select
  to authenticated
  using ((select private.is_admin()));

create index plan_selections_status_created_idx
  on public.plan_selections (status, created_at desc);

create table public.fit_submissions (
  id uuid primary key,
  degree text not null,
  years_experience text not null,
  progressive_experience text not null,
  exceptional_criteria text[] not null,
  prong_merit text not null,
  prong_positioned text not null,
  prong_balance text not null,
  plan_suggestion text not null,
  news_optin boolean not null,
  email text,
  created_at timestamptz not null default now(),
  constraint fit_submissions_degree check (degree in ('bachelor', 'master', 'phd', 'other')),
  constraint fit_submissions_years check (
    years_experience in ('under_2', 'two_to_four', 'five_to_nine', 'ten_plus')
  ),
  constraint fit_submissions_progressive check (
    progressive_experience in ('yes', 'no', 'not_applicable')
  ),
  constraint fit_submissions_criteria_size check (cardinality(exceptional_criteria) between 1 and 7),
  constraint fit_submissions_criteria_items check (
    exceptional_criteria <@ array[
      'academic_record', 'ten_year_letters', 'license', 'salary', 'membership', 'recognition', 'none'
    ]::text[]
  ),
  constraint fit_submissions_criteria_none check (
    not ('none' = any (exceptional_criteria)) or cardinality(exceptional_criteria) = 1
  ),
  constraint fit_submissions_merit check (prong_merit in ('yes', 'partly', 'not_yet')),
  constraint fit_submissions_positioned check (prong_positioned in ('yes', 'partly', 'not_yet')),
  constraint fit_submissions_balance check (prong_balance in ('yes', 'partly', 'not_yet')),
  constraint fit_submissions_plan check (plan_suggestion in ('diy', 'attorney_review', 'stretch')),
  constraint fit_submissions_optin_email check (
    (
      news_optin
      and email is not null
      and email = lower(email)
      and char_length(email) between 6 and 320
      and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    )
    or (not news_optin and email is null)
  )
);

comment on table public.fit_submissions is
  'One anonymous fit-check submission, including the news opt-in. The app sets plan_suggestion on the server.';

create index fit_submissions_created_idx
  on public.fit_submissions (created_at desc);

create table public.consult_clicks (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.fit_submissions (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.consult_clicks is
  'A Book now click on the fit-check thank-you screen.';

create index consult_clicks_created_idx
  on public.consult_clicks (created_at desc);

create index consult_clicks_submission_idx
  on public.consult_clicks (submission_id);

alter table public.fit_submissions enable row level security;
alter table public.consult_clicks enable row level security;

revoke all on table public.fit_submissions from public, anon, authenticated;
revoke all on table public.consult_clicks from public, anon, authenticated;

grant insert on table public.fit_submissions to anon, authenticated;
grant insert on table public.consult_clicks to anon, authenticated;
grant select on table public.fit_submissions to authenticated;
grant select on table public.consult_clicks to authenticated;

grant select, insert, update, delete on table public.fit_submissions to service_role;
grant select, insert, update, delete on table public.consult_clicks to service_role;

create policy "anon_insert_fit_submissions"
  on public.fit_submissions
  for insert
  to anon
  with check (true);

create policy "authenticated_insert_fit_submissions"
  on public.fit_submissions
  for insert
  to authenticated
  with check (true);

create policy "admin_select_fit_submissions"
  on public.fit_submissions
  for select
  to authenticated
  using ((select private.is_admin()));

create policy "anon_insert_consult_clicks"
  on public.consult_clicks
  for insert
  to anon
  with check (true);

create policy "authenticated_insert_consult_clicks"
  on public.consult_clicks
  for insert
  to authenticated
  with check (true);

create policy "admin_select_consult_clicks"
  on public.consult_clicks
  for select
  to authenticated
  using ((select private.is_admin()));

comment on policy "anon_insert_fit_submissions" on public.fit_submissions is
  'Insert-only for anon. No select, update, or delete policy for visitors.';
