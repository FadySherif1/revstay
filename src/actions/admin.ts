"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function assertAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

const emailSchema = z.string().email();
const statusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: "forbidden" | "notfound" | "invalid" | "generic" };

/** Promote an existing user (by email) to ADMIN. Admin-only. */
export async function promoteToAdmin(email: string): Promise<AdminActionResult> {
  if (!(await assertAdmin())) return { ok: false, error: "forbidden" };

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { ok: false, error: "invalid" };

  try {
    const res = await prisma.user.updateMany({
      where: { email: parsed.data.toLowerCase() },
      data: { role: "ADMIN" },
    });
    if (res.count === 0) return { ok: false, error: "notfound" };
    revalidatePath("/[locale]/admin", "page");
    return { ok: true };
  } catch (err) {
    console.error("promoteToAdmin failed:", err);
    return { ok: false, error: "generic" };
  }
}

/** Update a booking's status. Admin-only. */
export async function updateBookingStatus(
  id: string,
  status: string
): Promise<AdminActionResult> {
  if (!(await assertAdmin())) return { ok: false, error: "forbidden" };

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success || !id) return { ok: false, error: "invalid" };

  try {
    await prisma.booking.update({
      where: { id },
      data: { status: parsed.data },
    });
    revalidatePath("/[locale]/admin", "page");
    return { ok: true };
  } catch (err) {
    console.error("updateBookingStatus failed:", err);
    return { ok: false, error: "generic" };
  }
}
