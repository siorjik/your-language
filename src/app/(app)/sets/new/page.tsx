import Link from 'next/link'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { setsAppPath } from '@/utils/paths'

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
