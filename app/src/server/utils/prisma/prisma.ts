import { PrismaClient } from '@prisma/client'

const { DATABASE_URL } = useRuntimeConfig()

const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } })

export default prisma
