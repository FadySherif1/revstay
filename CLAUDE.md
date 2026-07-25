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
4. Admin can view meetings (later phase)

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

test tesytany 