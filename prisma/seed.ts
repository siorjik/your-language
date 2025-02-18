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

  console.log({ admin, test })
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
