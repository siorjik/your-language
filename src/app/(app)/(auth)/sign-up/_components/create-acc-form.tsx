'use client'

import z from 'zod'
import Link from 'next/link'

import Form from '@/components/forms/simple-form'

import { createAccFormTypeSchema } from '@/types/forms/auth'
import { createAcc } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { signInAppPath } from '@/utils/paths'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import apiRequestService from '@/services/apiRequestService'

export default function CreateAccountForm() {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof createAccFormTypeSchema>): Promise<boolean> => {
    try {
      const res: SelectedUser | Err = await createAcc(data)

      if (res && !res?.error) {
        await apiRequestService<{ success: boolean }>({
          url: '/api/email/create-pass',
          method: 'POST',
          body: { email: res.email, name: res.name },
        })

        toast({
          title: 'Account Creation',
          duration: 7000,
          description: 'Your account was created successfully! Check your email to create password and finish registration.',
        })
      } else throw res

      return true
    } catch (error) {
      const err = error as Err

      toast({ variant: 'destructive', title: 'Account Creation Error', description: err.error.message })

      return false
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
        btn={{ text: 'Create Account' }}
        showSpinner
        isReset
      />
      <div className="mt-8 w-fit mx-auto">
        Go to{' '}
        <Link className="link" href="/">
          Home
        </Link>{' '}
        or{' '}
        <Link className="link" href={signInAppPath}>
          Sign In
        </Link>{' '}
        page
      </div>
    </div>
  )
}
