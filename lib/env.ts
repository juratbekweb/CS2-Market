import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  STEAM_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SOCKET_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
}).superRefine((data, ctx) => {
  const resolvedSecret = data.AUTH_SECRET || data.NEXTAUTH_SECRET;

  if (!resolvedSecret) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET in the environment.",
      path: ["AUTH_SECRET"],
    });
  }

  if (data.NODE_ENV === "production") {
    if (!data.DATABASE_URL || data.DATABASE_URL.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DATABASE_URL is strictly required in production.",
        path: ["DATABASE_URL"],
      });
    }
  }
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  STEAM_API_KEY: process.env.STEAM_API_KEY,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!env.DATABASE_URL && env.NODE_ENV !== "production") {
  console.warn("⚠️ DATABASE_URL is not set. The application will run in Mock Mode.");
}
