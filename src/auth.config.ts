import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe base config: providers/callbacks that don't need Node APIs
// (Prisma, bcrypt). The Credentials provider and PrismaAdapter are added
// in src/auth.ts, which runs only in the Node runtime.
//
// The Google provider is included only when its credentials are present,
// so the button/flow stays dormant until AUTH_GOOGLE_ID/SECRET are set.
const googleEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

export const authConfig = {
  providers: googleEnabled
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          // Deliberately omitted: allowDangerousEmailAccountLinking. With it
          // on, signing in with Google would silently attach to any
          // existing credentials account sharing that email — no proof the
          // Google user actually owns the password-based account. Without
          // it, NextAuth blocks the sign-in and redirects with
          // error=OAuthAccountNotLinked, which the auth modal turns into a
          // friendly "sign in with your password instead" message.
        }),
      ]
    : [],
  pages: {
    // We use a modal, not a dedicated page; keep the default error routing.
    signIn: "/",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      // On sign-in, persist the user id + role into the token.
      if (user) {
        token.id = user.id;
        // `role` exists on our Prisma user; may be undefined for OAuth
        // first-login before the adapter fills it — default to USER.
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const isGoogleEnabled = googleEnabled;
