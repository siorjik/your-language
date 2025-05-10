'use client'

import z from 'zod'
import Link from 'next/link'

import Form from '@/components/forms/simple-form'
import OAuthBlock from '@/components/oauth-block'

import { createAccFormTypeSchema } from '@/types/forms/auth'
import { createAcc } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { emailCreatePassApiPath, signInAppPath } from '@/utils/paths'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import apiRequestService from '@/services/apiRequestService'

export default function SignUpForm({
  isMainPage = false,
  onSuccess = null,
}: {
  isMainPage?: boolean
  onSuccess?: (() => void) | null
}) {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof createAccFormTypeSchema>): Promise<boolean> => {
    try {
      const res: SelectedUser | Err = await createAcc(data)

      if (res && !res?.error) {
        await apiRequestService<{ success: boolean }>({
          url: emailCreatePassApiPath,
          method: 'POST',
          body: { email: res.email, name: res.name },
        })

        toast({
          title: 'Account Creation',
          duration: 7000,
          variant: 'success',
          description: 'Your account was created successfully! Check your email to create password and finish registration.',
        })

        onSuccess?.()
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
        showSpinner={!isMainPage}
        showLoader={isMainPage}
        isReset
      />
      <div className="mt-5">
        <OAuthBlock isMainPage={isMainPage} />
      </div>
      {!isMainPage && (
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
      )}
    </div>
  )
}
