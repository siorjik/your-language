import { notFound } from 'next/navigation'

import { getSetById } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { Set } from '@prisma/client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const set: (Set & { error: null }) | Err = await getSetById(id)

  if (set.error) notFound()

  return { title: `${set.title} spelling`, description: `${set.title} spelling page` }
}

export default function SetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
