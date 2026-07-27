# Revstay — Hotel Revenue & OTA Optimization Agency

## About
Revstay (revenue + stay) helps hotels increase guest bookings by creating
and optimizing their listings on Booking.com, Expedia, and TripAdvisor.
Target audience: hotel owners/managers. Goal: visitor understands the
service within seconds and books a free consultation meeting.

## Tech Stack (do not deviate)
- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS
- Framer Motion + GSAP ScrollTrigger + Lenis (smooth scroll)
- Prisma ORM + PostgreSQL (Neon)
- Auth.js (NextAuth v5): Google OAuth + Email/Password (bcrypt)
- Zod for all input validation
- Resend for transactional emails

## Design Direction
- Luxury hotel aesthetic: deep navy/charcoal base, gold/amber accents
- Award-winning feel: scroll-driven animations, animated stats counters,
  smooth page transitions, staggered reveals
- Fully responsive, RTL-ready (Arabic + English support planned)
- Fast: animations must not hurt Core Web Vitals

## Key Features
1. Landing page (hero, problem/solution, services, results stats,
   testimonials, OTA logos, CTA)
2. Auth: sign up / sign in (Google + email) — required before booking
3. Meeting booking: calendar picker, saves to DB, email confirmation
4. Admin dashboard: view meetings and update booking status

## Resend & Booking Email Architecture

### Ownership and production setup
- The Resend production team must be owned by a named company email
  (for example, `fady@revstay.com`), not a personal Gmail account or a
  shared mailbox as the sole owner.
- Keep at least two company admins in the Resend team for account recovery.
- Verify a dedicated sending subdomain such as `updates.revstay.com`.
- Use a production sender such as
  `Revstay Bookings <bookings@updates.revstay.com>`.
- The application API key must have Sending Access scoped to the Revstay
  domain. Never use a Full Access key in the application.

### Source of truth
- Booking identity comes from the authenticated user on the server.
- Never trust `name`, `email`, `userId`, role, price, or booking status sent
  by the browser.
- Load the user's canonical name and email from the database and store a
  snapshot on the Booking record.
- The account email should be read-only in the booking form. If an alternate
  address is needed later, add an explicit `contactEmail` field.
- Store meeting timestamps in UTC and render email dates in
  `Africa/Cairo`.

### Booking lifecycle and email events
1. Create the Booking with status `PENDING`.
2. In the same database transaction, create durable email-outbox records for:
   - `BOOKING_REQUEST_RECEIVED` to the customer.
   - `NEW_BOOKING_ADMIN` to each subscribed admin.
3. Commit the transaction before making any Resend network request.
4. Process pending email records asynchronously and retry transient failures.
5. When an admin changes the booking status, enqueue:
   - `BOOKING_CONFIRMED` for `CONFIRMED`.
   - `BOOKING_CANCELLED` for `CANCELLED`.
6. Optional later events: account verification and a 24-hour meeting reminder.

The first customer email must say that the request was received, not that the
meeting is confirmed, because new bookings start as `PENDING`.

### Admin recipients
- Authorization and notification subscriptions are separate concerns.
- Only users with `role = ADMIN` and `receivesBookingEmails = true` should
  receive booking notifications.
- `BOOKING_ADMIN_EMAILS` may be used as a temporary bootstrap/fallback
  configuration, but database-managed subscriptions are the target design.
- Send a separate email to each admin; do not expose the admin address list.

### Reliability and delivery tracking
- Add an `EmailDelivery`/outbox model containing at minimum:
  `bookingId`, `type`, `recipient`, `status`, `idempotencyKey`,
  `providerMessageId`, `attempts`, `nextAttemptAt`, `sentAt`,
  `deliveredAt`, and `lastError`.
- Make `idempotencyKey` unique in the database and also pass it to Resend.
  Use stable keys such as
  `booking/{bookingId}/request-received/{userId}` and
  `booking/{bookingId}/new-booking-admin/{adminId}`.
- A Resend outage must never roll back or hide a successfully created booking.
- Retry with bounded exponential backoff. After the retry limit, show the
  failure in the admin dashboard.
- Handle and verify Resend webhooks at `/api/webhooks/resend`.
- Track at least `email.sent`, `email.delivered`, `email.delivery_delayed`,
  `email.bounced`, `email.failed`, `email.complained`, and
  `email.suppressed`.
- Treat `email.delivered`, not `email.sent`, as proof of delivery to the
  recipient's mail server.
- Deduplicate webhook events using the provider/Svix event ID.

### Email content
- Customer emails: booking reference, requested/confirmed status, Cairo date
  and time, hotel name, and clear support/contact information.
- Admin emails: booking reference, customer name/email/phone, hotel details,
  room count, platforms, Cairo date/time, and a link to the admin booking.
- Escape all user-provided values before inserting them into HTML.
- Do not include sensitive notes unless the recipient is authorized to see
  them.

### Environment variables
```env
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
BOOKING_FROM_EMAIL="Revstay Bookings <bookings@updates.revstay.com>"
BOOKING_REPLY_TO="support@revstay.com"
BOOKING_ADMIN_EMAILS=
NEXT_PUBLIC_APP_URL="https://revstay.com"
```

### Suggested email module layout
```text
src/lib/email/
├── client.ts
├── types.ts
├── booking-notifications.ts
└── templates/
    ├── booking-request-received.ts
    ├── new-booking-admin.ts
    ├── booking-confirmed.ts
    ├── booking-cancelled.ts
    └── verify-email.ts

src/app/api/webhooks/resend/route.ts
src/app/api/cron/process-emails/route.ts
```

### Required notification tests
- A new booking produces one customer notification and one per subscribed
  admin.
- Replaying the booking action or retrying the worker does not duplicate mail.
- Invalid or bounced recipients do not remove or roll back the booking.
- Changing status to confirmed/cancelled emits exactly one matching email.
- Webhook signatures are verified and duplicate webhook events are ignored.
- Customer and admin emails render correctly in English and Arabic.

## Security Rules (always enforce)
- Never commit secrets; use .env.local (already in .gitignore)
- Validate every API input with Zod
- Hash passwords with bcrypt (12 rounds)
- Rate-limit auth & booking endpoints
- Set security headers in next.config

## Conventions
- Components in src/components, server actions in src/actions
- Run `npm run lint && npx tsc --noEmit` after changes
- Small commits with clear messages
