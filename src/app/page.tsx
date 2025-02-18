import Layout from '@/components/layout'
import { getToken } from 'next-auth/jwt'
import { headers } from 'next/headers'

// import delay from '@/helpers/delay'
import { auth } from '@/configs/auth'

export default async function Home() {
  // await delay(3000)
  const session = await auth()
  console.log(session?.user)

  const token = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
      // cookies: Object.fromEntries(
      //   cookies()
      //     .getAll()
      //     .map((c) => [c.name, c.value])
      // ),
    },
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log('token - ', token)

  return (
    <Layout>
      <div>{session?.user ? session.user.name : 'no auth'}</div>
    </Layout>
  )
}
