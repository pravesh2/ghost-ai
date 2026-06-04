import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const buildClient = () => {
  return new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
  })
}

const prisma = (global.__prisma ??= buildClient())

export default prisma
