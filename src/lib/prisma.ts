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
  if (process.env.VERCEL && url.startsWith("file:")) {
    const tmpDbPath = "/tmp/dev.db";
    const candidates = [
      path.join(process.cwd(), "dev.db"),
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "public", "dev.db"),
    ];

    try {
      if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
        for (const cand of candidates) {
          if (fs.existsSync(cand) && fs.statSync(cand).size > 0) {
            fs.copyFileSync(cand, tmpDbPath);
            console.log(`Copied SQLite database from ${cand} to ${tmpDbPath}`);
            break;
          }
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
  const client = new PrismaClient({ adapter });

  // Self-healing schema initializer for serverless SQLite
  if (url.startsWith("file:")) {
    ensureTablesExist(client).catch((err) => console.warn("Schema self-heal warning:", err));
  }

  return client;
}

async function ensureTablesExist(client: PrismaClient) {
  try {
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "phone" TEXT,
        "emailVerified" DATETIME,
        "currency" TEXT NOT NULL DEFAULT '$',
        "healthScore" REAL DEFAULT 100.0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "VerificationCode" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "code" TEXT NOT NULL,
        "expiresAt" DATETIME NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "type" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Transaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "amount" REAL NOT NULL,
        "date" DATETIME NOT NULL,
        "description" TEXT NOT NULL,
        "merchant" TEXT,
        "confidence" REAL DEFAULT 0.95,
        "isRecurring" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        "categoryId" TEXT,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Budget" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "limit" REAL NOT NULL,
        "month" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        "categoryId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Goal" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "targetAmount" REAL NOT NULL,
        "currentAmount" REAL NOT NULL DEFAULT 0.0,
        "deadline" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  } catch (err) {
    // Ignore if table creation is handled or concurrently exists
  }
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
