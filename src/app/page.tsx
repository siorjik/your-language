import Home from '@/components/home'
import Layout from '@/components/layout'

// import delay from '@/helpers/delay'
import { auth } from '@/configs/auth'

export default async function HomePage() {
  // await delay(3000)
  const session = await auth()
  // console.log(session?.user)

  return (
    <Layout>
      <Home session={session} />
    </Layout>
  )
}
