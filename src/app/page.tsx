import Layout from '@/components/layout'

import delay from '@/helpers/delay'
import { auth } from '@/configs/auth'

export default async function Home() {
  await delay(3000)

  const session = await auth()
  
  return (
    <Layout>
      <div>{session?.user ? 'with auth' : 'no auth'}</div>
    </Layout>
  )
}
