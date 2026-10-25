-- The eligibility quiz now asks for experience in four brackets:
-- less than 2 years, 2-4, 5-9, and 10+. Map any rows saved under the
-- older brackets, then replace the check constraints.

alter table public.intake drop constraint if exists intake_years_experience;

update public.intake
set years_experience = case years_experience
  when 'under_5' then 'two_to_four'
  when 'five_to_ten' then 'five_to_nine'
  when 'ten_to_fifteen' then 'ten_plus'
  when 'fifteen_plus' then 'ten_plus'
  else years_experience
end
where years_experience in ('under_5', 'five_to_ten', 'ten_to_fifteen', 'fifteen_plus');

alter table public.intake
  add constraint intake_years_experience check (
    years_experience in ('under_2', 'two_to_four', 'five_to_nine', 'ten_plus')
  );

alter table public.eligibility_responses drop constraint if exists eligibility_years;

update public.eligibility_responses
set years_experience = case years_experience
  when 'under_5' then 'two_to_four'
  when 'five_to_ten' then 'five_to_nine'
  when 'ten_to_fifteen' then 'ten_plus'
  when 'fifteen_plus' then 'ten_plus'
  else years_experience
end
where years_experience in ('under_5', 'five_to_ten', 'ten_to_fifteen', 'fifteen_plus');

alter table public.eligibility_responses
  add constraint eligibility_years check (
    years_experience in ('under_2', 'two_to_four', 'five_to_nine', 'ten_plus')
  );
