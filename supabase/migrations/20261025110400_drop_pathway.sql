-- The site is EB-2 NIW only, so the fit check no longer asks which path
-- someone is considering. Drop that stored answer. Run after the intake
-- and eligibility table migrations.

alter table public.intake drop column if exists pathway;
alter table public.eligibility_responses drop column if exists pathway;
