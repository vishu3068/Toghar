# Toghar

A mobile-first hostel booking marketplace showcase for Hyderabad. Built with Next.js App Router, TypeScript, Tailwind tokens, Prisma, and PostGIS. It includes seeded listing pages, student college search, owner/admin demos, and a demo checkout that confirms a sample booking without taking payment.

## Run locally (under 10 minutes)

Requirements: Node.js 20+, npm, and Docker Desktop (or a hosted Postgres/PostGIS database).

1. Copy `.env.example` to `.env` and keep `DEMO_MODE=true`. Prisma CLI loads `.env`; Next.js also reads it.
2. Start local PostGIS: `docker compose up -d`.
3. Install dependencies: `npm install`.
4. Create tables and geo indexes: `npx prisma migrate deploy`.
5. Add demo colleges, hostels, rooms, beds, and users: `npm run db:seed`.
6. Start the site: `npm run dev` and open http://localhost:3000.

Hosted database option: create a Neon or Supabase PostgreSQL database with PostGIS enabled, set both `DATABASE_URL` (pooled URL for runtime) and `DIRECT_URL` (direct URL for migrations) in `.env.local`, then run steps 3–6. For local Docker, the example URLs are already configured.

## Explore the demo

- Guest: `/login`, select Guest, continue; the demo OTP is `123456`.
- Owner dashboard: `/login`, select Owner. Or open `/owner` directly.
- Admin review panel: `/login`, select Admin. Or open `/admin` directly.
- College search: `/students`; select a suggested campus.
- Browse and book: choose any hostel, then **Book now**. Checkout shows rent, deposit, taxes, and platform fee and simulates success in demo mode.

Seed demo users: `guest@toghar.in`, `owner@toghar.in`, and `admin@toghar.in`. The showcase login does not persist a real authenticated session; add Auth.js/Supabase Auth before granting production access to dashboards or APIs.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install app dependencies |
| `npm run dev` | Start local development |
| `npm run db:migrate` | Create/update local development migrations |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:seed` | Seed Hyderabad showcase data |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next lint checks |
| `npm test` | Run pricing, cancellation, and availability tests |

With a migrated local database, also run the actual two-request Postgres locking test using `RUN_DB_CONCURRENCY=true npm test` (PowerShell: `$env:RUN_DB_CONCURRENCY='true'; npm test`).

## Data and images

Seed content includes 15 campuses and 25 illustrative hostels across Hyderabad, with demo room inventory and three demo roles. Listing photos are generic Unsplash placeholders, and the detail page labels them illustrative. Replace `coverImage` URLs in `prisma/seed.ts` with licensed property photos before launch. The supplied logo is preserved as `/public/brand/logo.png` and used through the shared `Logo` component.

## Vercel deployment

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository, and keep the Next.js framework preset.
3. Provision Neon or Supabase Postgres with PostGIS. Use the provider's pooled connection for `DATABASE_URL`; use its direct connection for `DIRECT_URL`.
4. Add every variable in `.env.example` to Vercel Project Settings. Set `NEXTAUTH_URL` to the production URL, `AUTH_SECRET` and `CRON_SECRET` to fresh random secrets, and initially keep `DEMO_MODE=true`.
5. Deploy. From a trusted local terminal with production `DATABASE_URL`/`DIRECT_URL` loaded, run `npx prisma migrate deploy` then `npm run db:seed`. Redeploy if needed.
6. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` for Razorpay test mode when the payment adapter is enabled. Set the webhook URL to `https://YOUR_DOMAIN/api/payments/webhook` and subscribe to `payment.captured` and `payment.failed`.
7. Add Resend and Upstash credentials when configured. Set `DEMO_MODE=false` only after real auth, payments, and role checks have been enabled.

### Post-deploy checklist

- [ ] Homepage loads over HTTPS.
- [ ] Supplied logo displays in header and footer.
- [ ] Student college suggestions return and open student results.
- [ ] A demo booking completes and shows confirmation.
- [ ] Owner and admin demo pages open and render.
- [ ] Mobile navigation, cards, search, and booking panel fit the viewport.
- [ ] Database is seeded and Cron endpoint is authorized.

## Showcase scope and production integrations

The web showcase and seed experience work without third-party credentials. `DEMO_MODE` and `DEMO_OTP` document and drive the sample flow. Before accepting real customers, connect Auth.js/Supabase Auth with role-checked sessions, enable the Razorpay order + signature flow, configure verified webhook handling, add Resend email delivery, and add Upstash rate limiting. The booking API demonstrates a transaction-scoped row lock and overlap query; use the supplied database booking API only behind authenticated server-side identity. Do not expose demo dashboards or the demo checkout as a live booking/payment system.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the data flow, scale choices, and growth path.
