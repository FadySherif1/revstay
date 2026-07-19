"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { signInSchema, signUpSchema } from "@/lib/auth-schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

const AUTH_MAX_ATTEMPTS = 5;
const BCRYPT_ROUNDS = 12;

export type SignUpResult =
  | { ok: true }
  | { ok: false; error: string; field?: "name" | "email" | "password" };

async function clientKey(scope: string): Promise<string> {
  return `${scope}:${await getClientIp()}`;
}

export type SignInResult = { ok: true } | { ok: false; error: string };

/**
 * Rate-limited email/password sign-in. Always returns a generic error on
 * failure — never reveals whether the email exists or which field was
 * wrong. Passwords are never logged.
 */
export async function signInWithCredentials(input: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const { allowed } = await checkRateLimit(await clientKey("signin"), AUTH_MAX_ATTEMPTS);
  if (!allowed) {
    return {
      ok: false,
      error: "Too many attempts. Please wait a minute and try again.",
    };
  }

  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid email or password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    });
    return { ok: true };
  } catch (err) {
    // Auth.js throws a redirect internally even with redirect:false in some
    // paths — let those bubble. Everything else is a failed login.
    if (isRedirectError(err)) throw err;
    return { ok: false, error: "Invalid email or password." };
  }
}

/**
 * Creates an email/password account. Returns a plain result object — the
 * caller signs the user in on success. Never returns or logs the password
 * or hash. Error messages are intentionally friendly and generic.
 */
export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SignUpResult> {
  const { allowed } = await checkRateLimit(await clientKey("signup"), AUTH_MAX_ATTEMPTS);
  if (!allowed) {
    return {
      ok: false,
      error: "Too many attempts. Please wait a minute and try again.",
    };
  }

  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0] as "name" | "email" | "password" | undefined;
    return { ok: false, error: "Please check the form and try again.", field };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      error: "An account with this email already exists.",
      field: "email",
    };
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.user.create({
    data: { name, email: normalizedEmail, hashedPassword },
  });

  return { ok: true };
}
