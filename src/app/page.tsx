import Home from '@/components/home'
import Layout from '@/components/layout'

// import delay from '@/helpers/delay'
import { getSetList } from '@/actions/set'
import { auth } from '@/configs/auth'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'

export default async function HomePage() {
  let res: { sets: Set[]; error: null } | Err | null
  // await delay(3000)
  const session = await auth()
  // console.log(session?.user)
  if (session) res = await getSetList()
  else res = null

  return (
    <Layout>
      <Home session={session} sets={(res?.error ? [] : res?.sets) || []} />
    </Layout>
  )
}
