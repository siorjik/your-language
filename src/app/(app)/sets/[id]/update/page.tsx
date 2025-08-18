import Link from 'next/link'
import { notFound } from 'next/navigation'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { getSetAppPath } from '@/utils/paths'
import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { SelectedSet } from '@/types/models/set'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return {
    title: `${set.title} | Language Bro`,
    description: `
      Update your Set with new terms and definitions.
      Edit and refine your study materials to keep your learning progress on track.
    `,
  }
}

export default async function SetUpdate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (SelectedSet & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={getSetAppPath(id)}>Cancel</Link>
      </Button>
      <h2 className="sub-title-1">Set Update:</h2>
      <SetForm data={{ ...set, list: set.list as { term: string; definition: string }[] }} action="update" />
    </>
  )
}
