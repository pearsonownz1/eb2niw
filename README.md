# eb2niw.com

Guided software for people preparing their own EB‑2 National Interest Waiver petition. The brand is EB2NIW.

EB2NIW is not a law firm, and attorney review is provided by independent attorneys.

## Develop

```bash
npm install
npm run dev
```

The app builds and runs without Supabase environment variables. The fit check still reaches a thank-you screen, and `/admin` shows labeled demo rows. Creating an account, saving a plan, or uploading a file then says Supabase is not configured.

## Supabase

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit real keys.

Apply the SQL files in `supabase/migrations` in order. `waitlist` and `intake` are older anonymous insert-only tables. The account workspace uses `profiles`, `plan_selections`, `eligibility_responses`, and `documents`, with row level security so a signed-in user only sees their own rows. Plan rows inserted by the app use status `pending_payment`. Payment is not collected.

`20261025120000_fit_submissions_and_admin.sql` adds `fit_submissions` and `consult_clicks` (anonymous insert only), adds `profiles.is_admin`, creates a profile row for every existing auth user, and sets `is_admin` for `guy@gcs.org` (`2ae16e07-9e15-4f54-924f-0997a8f2a239`). `/admin` reads through the signed-in user's session. A non-admin gets a 404. The service role key is not used by the app.

In Supabase Auth, set the site URL to `https://eb2niw.com` and allow redirects to `https://eb2niw.com/auth/callback`, `http://localhost:3000/auth/callback`, and each preview origin’s `/auth/callback`. Google sign-in uses the Supabase callback `https://qbqidudrbcgkqhbtcvml.supabase.co/auth/v1/callback` after the Google provider is enabled. Until then, the Google button explains that it is not turned on. Turn off Confirm email if a new account should continue straight to checkout.
