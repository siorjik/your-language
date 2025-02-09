import Layout from '@/components/layout'

// import delay from '@/helpers/delay'
import { auth } from '@/configs/auth'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // await delay(3000)
  const users = await prisma.user.findMany()
  console.log(users)

  const session = await auth()
  
  return (
    <Layout>
      <div>{session?.user ? 'with auth' : 'no auth'}</div>
    </Layout>
  )
}
