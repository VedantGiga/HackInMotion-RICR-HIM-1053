import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient() {
  let url = process.env.DATABASE_URL || "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

  // On Vercel serverless environment, local SQLite files in project root are read-only.
  // Copy or route local SQLite database to /tmp/dev.db for writable serverless execution
  if (process.env.VERCEL && url.startsWith("file:") && !url.includes("/tmp/")) {
    const tmpDbPath = "/tmp/dev.db";
    const rootDbPath = path.join(process.cwd(), "dev.db");
    const prismaDbPath = path.join(process.cwd(), "prisma", "dev.db");
    
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(prismaDbPath)) {
          fs.copyFileSync(prismaDbPath, tmpDbPath);
        } else if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }
    } catch (e) {
      console.warn("Vercel /tmp DB init warning:", e);
    }
    url = `file:${tmpDbPath}`;
  }

  const adapter = new PrismaLibSql({ 
    url, 
    ...(authToken ? { authToken } : {}) 
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
