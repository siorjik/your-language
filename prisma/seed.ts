import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@email.net' },
    update: {},
    create: {
      email: 'admin@email.net',
      name: 'admin',
      role: 'admin',
      isActive: true,
      password: '$2b$10$pPr4wTNfosXBCV2sH9vMGerAXuxL.lxk2TY3uCeCh.xxPL3qBBNHC'
    },
  })

  const test = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'test',
      role: 'user',
      isActive: true,
      password: '$2b$10$pPr4wTNfosXBCV2sH9vMGerAXuxL.lxk2TY3uCeCh.xxPL3qBBNHC'
    },
  })

  const flashcards = await prisma.activityType.upsert({
    where: { name: 'flashcards' },
    update: {},
    create: {
      name: 'flashcards'
    }
  })

  const memorization = await prisma.activityType.upsert({
    where: { name: 'memorization' },
    update: {},
    create: {
      name: 'memorization'
    }
  })

  const spelling = await prisma.activityType.upsert({
    where: { name: 'spelling' },
    update: {},
    create: {
      name: 'spelling'
    }
  })

  const associations = await prisma.activityType.upsert({
    where: { name: 'associations' },
    update: {},
    create: {
      name: 'associations'
    }
  })

  console.log({ admin, test, flashcards, memorization, spelling, associations })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
