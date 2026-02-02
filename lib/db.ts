
import {PrismaClient} from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Use global prisma instance in development to prevent multiple instances
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
