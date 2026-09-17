import z from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters.")
  .max(50, "Cannot be longer than 50 characters")
  .regex(/^[a-zA-Z0-9-'\s]+$/, {
    error:
      "Can only contain letters(a-z, A-Z), numbers(0-9), hyphen(-) or apostrophe(').",
  });

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Must be at least 3 characters.")
  .max(25, "Cannot be longer than 25 characters")
  .regex(/^[a-zA-Z0-9_]+$/, {
    error:
      "Can only contain lowercase letters(a-z), numbers(0-9) and underscores(_).",
  });

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(64, "Password cannot contain more than 64 characters.")
  .refine((password) => /[a-z]/.test(password), {
    error: "Password needs to contain at least one lowercase letter(a-z).",
  })
  .refine((password) => /[A-Z]/.test(password), {
    error: "Password needs to contain at least one uppdercase letter(A-Z).",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Password needs to contain at least one number(0-9).",
  })
  .refine((password) => /[^a-zA-Z0-9]/.test(password), {
    error: "Password needs to contain at least one special character.",
  });

export const emailSchema = z.email("Needs to be a valid email.").trim().toLowerCase();
