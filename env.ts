import { z } from "zod";

const envSchema = z.object({
  // Server-only variables
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  DATABASE_TOKEN: z.string("DATABASE_Token must be a string"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
});

// Parse process.env against schema
const _env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_TOKEN: process.env.DATABASE_TOKEN,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
});

if (!_env.success) {
  console.error(" Invalid environment variables:", z.prettifyError(_env.error));
  throw new Error("Invalid environment variables. Fix .env configuration.");
}

// Export the validated, typed object
export const env = _env.data;
