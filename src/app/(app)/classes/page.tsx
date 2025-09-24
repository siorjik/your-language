import { getSetList } from '@/actions/set'
import ClassList from './_components/class-list'
import { SelectedSet } from '@/types/models/set'
import { Err } from '@/types/errTypes'
import { notFound } from 'next/navigation'
import { getClassList } from '@/actions/class'
import { SelectedClass } from '@/types/models/class'

export default async function Classes({ searchParams }: { searchParams: Promise<{ title: string }> }) {
  const { title } = await searchParams

  const resSets: { sets: SelectedSet[]; error: null } | Err = await getSetList()
  const resClasses: { classes: SelectedClass[]; error: null } | Err = await getClassList({ title })

  if (resSets.error || resClasses.error) notFound()

  return (
    <>
      <ClassList isSimple={false} sets={resSets.sets} classes={resClasses.classes} />
    </>
  )
}
