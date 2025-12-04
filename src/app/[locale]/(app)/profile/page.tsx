import { headers } from 'next/headers'

import ProfileTabs from './_components/tabs'

import apiRequestService from '@/services/apiRequestService'
import { auth } from '@/configs/auth'
import { twoFaApiPath } from '@/utils/paths'

export default async function Profile() {
  let twoFaData: { data: string; secret: string } | null = null

  const session = await auth()
  const isCredentials = session?.user.isCredentials

  if (!session?.user.isTwoFa) twoFaData = await apiRequestService({ url: `${twoFaApiPath}`, headers: await headers() })

  return <ProfileTabs twoFaData={twoFaData} isCredentials={isCredentials} />
}
