# eb2niw.com

Standalone placeholder site for people preparing their own EB-2 National Interest Waiver petitions. The brand is EB2NIW.

Not a law firm; information only, not legal advice.

## Develop

```bash
npm install
npm run dev
```

The app builds and runs without Supabase environment variables. The email signup then shows a configuration error.

## Supabase

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit real keys.

Apply `supabase/migrations/*_create_waitlist.sql` before collecting signups. The `waitlist` table allows anonymous inserts only. The signup client does not request the inserted row back, because there is no select policy.
