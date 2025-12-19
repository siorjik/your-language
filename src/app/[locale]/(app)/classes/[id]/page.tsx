import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { ImageIcon, User2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Link from '@/components/link'
import BreadcrumbWrap from '@/components/breadcrumb-wrap'
import BtnPanel from './_components/btn-panel'
import Activities from './_components/activities'
import RequestBtn from './_components/request-btn'

import { getClassById, getClassSets, getClassUsers } from '@/actions/class'
import { SelectedClass } from '@/types/models/class'
import { Err } from '@/types/errTypes'
import { classesAppPath, getClassAppPath, getUserAppPath, libraryAppPath } from '@/utils/paths'
import getServerSessionToken from '@/helpers/getServerSessionToken'
import { SelectedSet } from '@/types/models/set'
import { SelectedUser } from '@/types/models/user'
import { getSetList } from '@/actions/set'
import { BLURRED_DATA_URL } from '@/utils/constants'
import { ModalContextProvider } from '@/contexts/modal-context'

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
    const res: (SelectedClass & { error: null }) | Err = await getClassById(id)

    if (res.error) notFound()

    return { title: `${res.title} | Language Bro`, description: 'Review your current Class and make some changes if it needed.' }
  }

  return null
}

export default async function ClassInfo({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ creator?: string }>
}) {
  const { locale, id } = await params
  const { creator } = await searchParams

  const session = await getServerSessionToken()
  const tClasses = await getTranslations({ locale, namespace: 'Classes.item' })
  const tMenu = await getTranslations({ locale, namespace: 'menu' })

  const res: (SelectedClass & { error: null }) | Err = await getClassById(id, creator)
  const classSets: { sets: SelectedSet[]; error: null } | Err = await getClassSets(id)
  const classUsers: { users: SelectedUser[]; error: null } | Err = await getClassUsers(id)
  const resSets: { sets: SelectedSet[]; error: null } | Err = await getSetList()

  if (res && creator && !res.error) redirect(getClassAppPath(res.id))

  if (res.error || classSets.error || classUsers.error || resSets.error) notFound()

  const isMember = res.users.includes(session.id)
  const isCreator = session.id === res.creatorId

  const breadcrumbData = {
    links: [
      { href: libraryAppPath, label: tMenu('library') },
      { href: classesAppPath, label: tMenu('classes') },
    ],
    current: res.title,
  }

  const { id: classId, image, users, sets, title } = res

  const getUniqueSets = () => {
    const sets = [...resSets.sets, ...classSets.sets]
    const list: SelectedSet[] = []

    sets.forEach((set) => {
      if (!list.find((el) => el.id === set.id)) list.push(set)
    })

    return list
  }

  return (
    <ModalContextProvider>
      <BreadcrumbWrap data={breadcrumbData} />
      <div
        className={`
        mb-8 height-fit grid grid-cols-3  ${isCreator ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}
        ${isCreator ? 'grid-rows-[auto_auto] lg:grid-rows-1' : 'grid-rows-1'} gap-8
      `}
      >
        <div className="col-span-3 md:col-span-2 flex flex-col md:flex-row gap-6 items-center">
          <div>
            {res.image ? (
              <Image
                className="object-cover h-[200px] min-w-[200px] max-w-[200px] border-4 rounded-3xl"
                width={200}
                height={200}
                src={res.image}
                alt={res.image}
                priority
                placeholder="blur"
                blurDataURL={BLURRED_DATA_URL}
              />
            ) : (
              <ImageIcon className="w-[200px] h-[200px] border-4 rounded-3xl !cursor-auto" size={200} />
            )}
          </div>
          <div className="flex flex-col items-center md:items-start gap-2 font-semibold">
            <h2 className="text-center md:text-start title mb-5 line-clamp-3">{res.title}</h2>
            <div className="block md:hidden">
              <Link className="flex gap-2" href={getUserAppPath(res.creatorId)}>
                <span className="text-muted-foreground/50 text-lg">{tClasses('creator')}</span>{' '}
                <div className="flex gap-1 items-center">
                  {res.creator.image && (
                    <Image
                      className="min-w-5 max-w-5 h-5 rounded-full object-cover"
                      src={res.creator.image}
                      alt={res.creator.image}
                      width={50}
                      height={50}
                    />
                  )}
                  <span className="link">{res.creator.name}</span>
                </div>
              </Link>
            </div>
            <p>
              <span className="text-muted-foreground/50 text-lg">{tClasses('sets')}</span> {res.sets.length}
            </p>
            <p>
              <span className="text-muted-foreground/50 text-lg">{tClasses('members')}</span> {res.users.length}
            </p>
          </div>
        </div>
        <Link
          href={getUserAppPath(res.creatorId)}
          className="mx-auto min-w-28 max-w-28 self-end sub-title-1 hidden md:block truncate text-center hover:!text-secondary"
        >
          {res.creator.image ? (
            <Image
              className="mb-2 border-2 rounded-full w-28 h-28 object-cover"
              width={70}
              height={70}
              src={res.creator.image}
              alt={res.creator.image}
              placeholder="blur"
              blurDataURL={BLURRED_DATA_URL}
            />
          ) : (
            <div className="mb-2 w-28 h-28 border-2 rounded-full flex justify-center items-center">
              <User2 size={70} />
            </div>
          )}
          {res.creator.name}
        </Link>
        {isCreator && (
          <div className="col-span-3 lg:col-span-1 lg:flex lg:items-center lg:justify-end">
            <BtnPanel data={{ id: classId, title, sets, users, image }} sets={getUniqueSets()} users={classUsers.users} />
          </div>
        )}
      </div>
      {isMember || isCreator ? (
        <Activities sets={classSets.sets} />
      ) : (
        <div className="flex justify-center">
          <RequestBtn classId={res.id} recipientId={res.creatorId} />
        </div>
      )}
    </ModalContextProvider>
  )
}
