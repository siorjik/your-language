import Link from 'next/link'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { setAppPath } from '@/utils/paths'

export default function NewSet() {
  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={setAppPath}>Cancel</Link>
      </Button>
      <SetForm action="create" />
    </>
  )
}
