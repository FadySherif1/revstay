import { z } from "zod";

// Password: min 8 chars, at least one letter and one number.
export const passwordSchema = z
  .string()
  .min(8)
  .refine((v) => /[a-zA-Z]/.test(v) && /[0-9]/.test(v));

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().email(),
  password: passwordSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
