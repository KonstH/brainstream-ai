import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Note: We use globalThis.prisma here to avoid instanciating multiple prisma clients in development
 * whenever we hot-reload the page.
 */
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;