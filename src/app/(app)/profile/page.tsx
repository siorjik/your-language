import apiRequestService from '@/services/apiRequestService'
import { auth } from '@/configs/auth'
import { twoFaApiPath } from '@/utils/paths'
import { headers } from 'next/headers'

import ProfileTabs from './_components/tabs'

export default async function Profile() {
  let twoFaData: { data: string; secret: string } | null = null

  const session = await auth()
  console.log('session - ', session?.user)

  if (!session?.user.isTwoFa) twoFaData = await apiRequestService({ url: `${twoFaApiPath}`, headers: await headers() })

  return <ProfileTabs twoFaData={twoFaData} />
}
