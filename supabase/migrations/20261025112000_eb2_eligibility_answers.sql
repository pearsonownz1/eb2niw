-- Store the EB-2 eligibility answers: advanced degree, exceptional-ability
-- criteria, and the three national-interest prongs. Drop the earlier
-- compensation, role, signal, status, and writing columns. Run after the
-- years-bracket migration.

alter table public.intake
  add column if not exists progressive_experience text,
  add column if not exists exceptional_criteria text[],
  add column if not exists prong_merit text,
  add column if not exists prong_positioned text,
  add column if not exists prong_balance text;

update public.intake
set
  progressive_experience = coalesce(progressive_experience, 'not_applicable'),
  exceptional_criteria = coalesce(exceptional_criteria, array['none']::text[]),
  prong_merit = coalesce(prong_merit, 'not_yet'),
  prong_positioned = coalesce(prong_positioned, 'not_yet'),
  prong_balance = coalesce(prong_balance, 'not_yet');

alter table public.intake
  alter column progressive_experience set not null,
  alter column exceptional_criteria set not null,
  alter column prong_merit set not null,
  alter column prong_positioned set not null,
  alter column prong_balance set not null;

alter table public.intake drop constraint if exists intake_progressive_experience;
alter table public.intake drop constraint if exists intake_exceptional_criteria_size;
alter table public.intake drop constraint if exists intake_exceptional_criteria_items;
alter table public.intake drop constraint if exists intake_exceptional_criteria_none;
alter table public.intake drop constraint if exists intake_prong_merit;
alter table public.intake drop constraint if exists intake_prong_positioned;
alter table public.intake drop constraint if exists intake_prong_balance;

alter table public.intake
  add constraint intake_progressive_experience check (
    progressive_experience in ('yes', 'no', 'not_applicable')
  ),
  add constraint intake_exceptional_criteria_size check (
    cardinality(exceptional_criteria) between 1 and 7
  ),
  add constraint intake_exceptional_criteria_items check (
    exceptional_criteria <@ array[
      'academic_record', 'ten_year_letters', 'license', 'salary', 'membership', 'recognition', 'none'
    ]::text[]
  ),
  add constraint intake_exceptional_criteria_none check (
    not ('none' = any (exceptional_criteria)) or cardinality(exceptional_criteria) = 1
  ),
  add constraint intake_prong_merit check (prong_merit in ('yes', 'partly', 'not_yet')),
  add constraint intake_prong_positioned check (prong_positioned in ('yes', 'partly', 'not_yet')),
  add constraint intake_prong_balance check (prong_balance in ('yes', 'partly', 'not_yet'));

alter table public.intake
  drop column if exists compensation,
  drop column if exists role_level,
  drop column if exists profile_signals,
  drop column if exists current_status,
  drop column if exists writing_comfort;

alter table public.eligibility_responses
  add column if not exists progressive_experience text,
  add column if not exists exceptional_criteria text[],
  add column if not exists prong_merit text,
  add column if not exists prong_positioned text,
  add column if not exists prong_balance text;

update public.eligibility_responses
set
  progressive_experience = coalesce(progressive_experience, 'not_applicable'),
  exceptional_criteria = coalesce(exceptional_criteria, array['none']::text[]),
  prong_merit = coalesce(prong_merit, 'not_yet'),
  prong_positioned = coalesce(prong_positioned, 'not_yet'),
  prong_balance = coalesce(prong_balance, 'not_yet');

alter table public.eligibility_responses
  alter column progressive_experience set not null,
  alter column exceptional_criteria set not null,
  alter column prong_merit set not null,
  alter column prong_positioned set not null,
  alter column prong_balance set not null;

alter table public.eligibility_responses drop constraint if exists eligibility_progressive_experience;
alter table public.eligibility_responses drop constraint if exists eligibility_exceptional_criteria_size;
alter table public.eligibility_responses drop constraint if exists eligibility_exceptional_criteria_items;
alter table public.eligibility_responses drop constraint if exists eligibility_exceptional_criteria_none;
alter table public.eligibility_responses drop constraint if exists eligibility_prong_merit;
alter table public.eligibility_responses drop constraint if exists eligibility_prong_positioned;
alter table public.eligibility_responses drop constraint if exists eligibility_prong_balance;

alter table public.eligibility_responses
  add constraint eligibility_progressive_experience check (
    progressive_experience in ('yes', 'no', 'not_applicable')
  ),
  add constraint eligibility_exceptional_criteria_size check (
    cardinality(exceptional_criteria) between 1 and 7
  ),
  add constraint eligibility_exceptional_criteria_items check (
    exceptional_criteria <@ array[
      'academic_record', 'ten_year_letters', 'license', 'salary', 'membership', 'recognition', 'none'
    ]::text[]
  ),
  add constraint eligibility_exceptional_criteria_none check (
    not ('none' = any (exceptional_criteria)) or cardinality(exceptional_criteria) = 1
  ),
  add constraint eligibility_prong_merit check (prong_merit in ('yes', 'partly', 'not_yet')),
  add constraint eligibility_prong_positioned check (prong_positioned in ('yes', 'partly', 'not_yet')),
  add constraint eligibility_prong_balance check (prong_balance in ('yes', 'partly', 'not_yet'));

alter table public.eligibility_responses
  drop column if exists compensation,
  drop column if exists role_level,
  drop column if exists profile_signals,
  drop column if exists current_status,
  drop column if exists writing_comfort;
