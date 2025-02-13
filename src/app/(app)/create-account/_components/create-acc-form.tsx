'use client'

import z from 'zod'
import Link from 'next/link'

import Form from '@/components/simple-form'

import { createAccFormTypeSchema } from '@/types/forms/auth'
import { createAcc } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { loginAppPath } from '@/utils/paths'

export default function CreateAccountForm() {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof createAccFormTypeSchema>) => {
    const res = await createAcc(data)

    if ('error' in res) {
      toast({ variant: 'destructive', title: 'Account Creation Error', description: res.error })

      return false
    } else {
      toast({
        title: 'Account Creation',
        description: 'Your account was created successfully! Check your email to create password and finish registration.',
      })

      return true
    }
  }

  const fieldData = [
    { name: 'email', label: 'Email*' },
    { name: 'name', label: 'Name*' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form
        submit={submit}
        schema={createAccFormTypeSchema}
        fieldsData={fieldData}
        btnText="Create Account"
        showSpinner
        isReset
      />
      <div className="mt-8 w-fit mx-auto">
        Go to{' '}
        <Link className="link" href="/">
          Home
        </Link>{' '}
        or{' '}
        <Link className="link" href={loginAppPath}>
          Sign In
        </Link>{' '}
        page
      </div>
    </div>
  )
}
