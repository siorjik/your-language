import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import SetForm from '@/components/forms/set-form'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import BtnPanel from './_components/btn-panel'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { getSetAppPath, libraryAppPath, setsAppPath } from '@/utils/paths'
import { SelectedSet } from '@/types/models/set'
import getServerSessionToken from '@/helpers/getServerSessionToken'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ creator?: string }>
}) {
  const { id } = await params
  const { creator } = await searchParams

  if (!creator) {
    const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

    if (set.error) notFound()

    return { title: `${set.title} | Language Bro`, description: 'Review your current Set and make some changes if it needed.' }
  }

  return null
}

export default async function SetData({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ creator?: string }>
}) {
  const { locale, id } = await params
  const { creator } = await searchParams

  const session = await getServerSessionToken()
  const t = await getTranslations({ locale, namespace: 'menu' })

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id, creator)

  if (set && creator && !set.error) redirect(getSetAppPath(set.id))

  if (set.error) notFound()

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: t('library') },
      { href: setsAppPath, label: t('sets') },
    ],
    current: set.title,
  }

  return (
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <div className="mb-8">
        <BtnPanel id={id} isCreator={set.creatorId === session.id} isOwner={session.id === set.userId} />
      </div>
      <SetForm data={{ ...set, list: set.list }} />
    </>
  )
}
