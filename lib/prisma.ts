import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

const url = process.env.DATABASE_URL ?? ''

const buildClient = () => {
  const options: any = {}

  if (url.startsWith('prisma+postgres://')) {
    // Use Accelerate via accelerateUrl
    options.accelerateUrl = url
  } else {
    // Try to attach the Postgres adapter if available; if not, fallback to defaults
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
      const adapterModule = require('@prisma/adapter-pg')
      // Adapter implementations may export different shapes; attach if present
      if (adapterModule && adapterModule.PostgresAdapter) {
        // eslint-disable-next-line new-cap
        options.adapter = new adapterModule.PostgresAdapter()
      } else if (adapterModule && adapterModule.default) {
        options.adapter = adapterModule.default
      }
    } catch (e) {
      // adapter not installed or failed to load; Prisma will use default driver
    }
  }

  return new PrismaClient(options)
}

const prisma = (global.__prisma ??= buildClient())

export default prisma
