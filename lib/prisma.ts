import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isMockMode = !process.env.DATABASE_URL;

if (isMockMode && process.env.NODE_ENV !== "production") {
  console.log("🛠️ Prisma initialized in Mock Mode (No DATABASE_URL found)");
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

if (!isMockMode && process.env.NODE_ENV === "production") {
  prisma.$connect().catch((error) => {
    console.error("❌ Failed to connect to the database in production mode:");
    console.error(error);
  });
}
