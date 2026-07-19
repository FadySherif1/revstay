import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { signInSchema } from "@/lib/auth-schemas";
import { isBootstrapAdmin } from "@/lib/admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // PrismaAdapter persists OAuth users/accounts. With the JWT session
  // strategy (required alongside Credentials), it also lets the Google
  // flow create User rows via our Prisma 7 generated client.
  adapter: PrismaAdapter(prisma),
  events: {
    // Auto-promote bootstrap admin emails on any successful sign-in, so
    // they become ADMIN even if they registered before this existed.
    async signIn({ user }) {
      if (user?.email && isBootstrapAdmin(user.email)) {
        await prisma.user.updateMany({
          where: { email: user.email.toLowerCase(), role: { not: "ADMIN" } },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        // No user, or a Google-only account with no password set. Both
        // cases return the same generic "invalid credentials" error (see
        // signInWithCredentials in actions/auth.ts) rather than a specific
        // "sign in with Google instead" message — telling them which one it
        // is would leak whether the email is registered at all.
        if (!user?.hashedPassword) return null;

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;

        // Bootstrap admins are ADMIN regardless of stored role (the signIn
        // event also persists it).
        const role = isBootstrapAdmin(user.email) ? "ADMIN" : user.role;

        // Returned object seeds the JWT (never include the hash).
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role,
        };
      },
    }),
  ],
});
