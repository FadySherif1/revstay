import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";

/**
 * Server-side guard for protected pages (e.g. a future /account or
 * /bookings route). Returns the session when signed in; otherwise
 * redirects to the localized home page (where the auth modal lives).
 *
 * Usage in a server component:
 *   const session = await requireAuth();
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }
  return session!;
}
