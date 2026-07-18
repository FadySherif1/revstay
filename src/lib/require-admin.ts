import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";

/**
 * Server-side guard for admin-only pages. Returns the session when the
 * user is an ADMIN; otherwise redirects to the localized home page.
 */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }
  return session!;
}
