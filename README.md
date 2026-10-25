# eb2niw.com

Guided software for people preparing their own EB-2 National Interest Waiver petition. The brand is EB2NIW.

EB2NIW is not a law firm, and attorney review is provided by independent attorneys.

## Develop

```bash
npm install
npm run dev
```

The app builds and runs without Supabase environment variables. The fit check still shows a recommendation, then says the answers could not be stored.

## Supabase

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit real keys.

Apply the SQL files in `supabase/migrations` before collecting answers. `intake` stores the fit check from the home page and `/start`: the eight answers, the plan suggestion, and the name, email, optional phone, and marketing consent from the result screen. `waitlist` is a separate email-only table. Both allow anonymous inserts only. The clients do not request inserted rows back, because there is no select policy.
