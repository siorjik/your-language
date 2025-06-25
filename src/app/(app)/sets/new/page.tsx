import Link from 'next/link'
import type { Metadata } from 'next'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { setsAppPath } from '@/utils/paths'

export const metadata: Metadata = { title: 'New Set Creation', description: 'New Set Creation page' }

export default function NewSet() {
  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={setsAppPath}>Cancel</Link>
      </Button>
      <SetForm action="create" />
    </>
  )
}
