import Layout from '@/components/layout'

import delay from '@/helpers/delay'

export default async function Home() {
  await delay(3000)
  
  return (
    <Layout>
      <div className='my-1'>Loading</div>
    </Layout>
  )
}
