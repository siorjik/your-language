import Image from 'next/image'
import { notFound } from 'next/navigation'
import { User2 } from 'lucide-react'

import Tabs from './_components/tabs'

import { getSetList } from '@/actions/set'
import { getUserById } from '@/actions/user'
import { Err } from '@/types/errTypes'
import { SelectedUser } from '@/types/models/user'
import { SelectedSet } from '@/types/models/set'
import { auth } from '@/configs/auth'

export default async function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const user: SelectedUser | null | Err = await getUserById(id)

  if (!user || user.error) notFound()

  const setRes: { sets: SelectedSet[]; error: null } | Err = await getSetList(null, user.id)

  if (setRes.error) notFound()

  return (
    <>
      <div className="w-fit mb-10 mx-auto">
        <h2 className="w-fit mx-auto sub-title-1">{user.name}</h2>
        {!!user.image ? (
          <Image className="rounded-full object-cover w-40 h-40" width={100} height={100} src={user.image} alt="user" />
        ) : (
          <User2 className="w-40 h-40 pb-5 border-2 rounded-full" />
        )}
      </div>
      <Tabs sets={setRes.sets} isCreator={session?.user.email === user.email} />
    </>
  )
}
