import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import SetItem from './_components/set-item'

import { getSetList } from '@/actions/set'
import { newSetAppPath, setAppPath } from '@/utils/paths'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'

// export const dynamic = 'force-dynamic'

export default async function Sets() {
  const res: { sets: Set[]; error: null } | Err = await getSetList()

  if (res.error) notFound()

  return (
    <>
      <Button className="mb-5">
        <Link href={`${newSetAppPath}`}>Create</Link>
      </Button>
      {res.sets.map((set) => (
        <Link key={set.id} href={`${setAppPath}/${set.id}`}>
          <SetItem set={set} />
        </Link>
      ))}
    </>
  )
}
