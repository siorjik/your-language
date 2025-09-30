import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { ImageIcon, User2 } from 'lucide-react'
import Link from 'next/link'

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
  params: Promise<{ id: string }>
  searchParams: Promise<{ creator?: string }>
}) {
  const { id } = await params
  const { creator } = await searchParams
  const session = await getServerSessionToken()

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
      { href: libraryAppPath, label: 'Library' },
      { href: classesAppPath, label: 'Classes' },
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
    <>
      <BreadcrumbWrap data={breadcrumbData} />
      <div className="mb-8 flex justify-center gap-52 items-center">
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="flex items-center">
            {res.image ? (
              <Image
                className="object-cover h-[200px] min-w-[200px] max-w-[200px] border-4 rounded-xl"
                width={200}
                height={200}
                src={res.image}
                alt={res.image}
                priority
              />
            ) : (
              <ImageIcon className="w-[200px] h-[200px] border-4 rounded-xl !cursor-auto" size={200} />
            )}
          </div>
          <div className="flex flex-col gap-2 font-semibold">
            <h2 className="sub-title-1">{res.title}</h2>
            <p className="block md:hidden">
              <Link href={getUserAppPath(res.creatorId)}>
                <span className="text-primary text-lg">Creator:</span> <span className="link">{res.creator.name}</span>
              </Link>
            </p>
            <p>
              <span className="text-primary text-lg">Sets:</span> {res.sets.length}
            </p>
            <p>
              <span className="text-primary text-lg">Members:</span> {res.users.length}
            </p>
          </div>
        </div>
        <Link
          href={getUserAppPath(res.creatorId)}
          className="w-28 sub-title-3 hidden md:block text-center hover:!text-secondary truncate"
        >
          {res.creator.image ? (
            <Image
              className="mb-2 border-2 rounded-full w-28 h-28 object-cover"
              width={70}
              height={70}
              src={res.creator.image}
              alt={res.creator.image}
            />
          ) : (
            <div className="mb-2 w-28 h-28 border-2 rounded-full flex justify-center items-center">
              <User2 size={70} />
            </div>
          )}
          {res.creator.name}
        </Link>
      </div>
      {isCreator && (
        <div className="mb-8">
          <BtnPanel data={{ id: classId, title, sets, users, image }} sets={getUniqueSets()} users={classUsers.users} />
        </div>
      )}
      {isMember || isCreator ? (
        <Activities sets={classSets.sets} />
      ) : (
        <div className="flex justify-center">
          <RequestBtn classId={res.id} recipientId={res.creatorId} />
        </div>
      )}
    </>
  )
}
