// Bootstrap admin emails. These accounts are promoted to ADMIN on sign-in
// (and via the seed script). Additional admins are promoted from the
// dashboard afterwards. Compared case-insensitively.
export const BOOTSTRAP_ADMIN_EMAILS = [
  "fadysheriftawfik@gmail.com",
  "maromagdy433@gmail.com",
];

export function isBootstrapAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return BOOTSTRAP_ADMIN_EMAILS.includes(email.toLowerCase());
}
