import Link from 'next/link'
import type { Metadata } from 'next'

import SetForm from '@/components/forms/set-form'
import { Button } from '@/components/ui/button'

import { setsAppPath } from '@/utils/paths'

export const metadata: Metadata = {
  title: 'New Set Creation | Language Bro',
  description: `Create new sets to expand your vocabulary with new words and
    improve your memorization with flashcards, quizzes and spelling.`,
}

export default function NewSet() {
  return (
    <>
      <Button className="mb-8" asChild>
        <Link href={setsAppPath}>Cancel</Link>
      </Button>
      <h2 className="sub-title-1">Set Creation:</h2>
      <SetForm action="create" />
    </>
  )
}
