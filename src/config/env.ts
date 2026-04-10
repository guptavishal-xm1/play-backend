import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ADMIN_TOKEN: z.string().min(8),
  IS_QUIZ_DEFAULT: booleanFromEnv.default(true),
  DEFAULT_REDIRECT_URL: z.string().url(),
  REDIRECT_ALLOWED_HOSTS: z.string().min(1),
  OPEN_TRIVIA_BASE_URL: z.string().url().default("https://opentdb.com"),
  OPEN_TRIVIA_AMOUNT: z.coerce.number().int().min(1).max(20).default(5),
  OPEN_TRIVIA_CATEGORY: z.string().optional(),
  OPEN_TRIVIA_DIFFICULTY: z.enum(["easy", "medium", "hard"]).optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const allowedHosts = parsed.data.REDIRECT_ALLOWED_HOSTS.split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

export const env = {
  ...parsed.data,
  REDIRECT_ALLOWED_HOSTS_LIST: allowedHosts
};
