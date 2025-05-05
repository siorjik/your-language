'use client'

import z from 'zod'

import Form from '@/components/forms/simple-form'

import { createPassFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { recoverPass } from '@/actions/auth'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import { signInAppPath } from '@/utils/paths'

export default function RecoverPasswordForm({ token }: { token: string | '' }) {
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof createPassFormTypeSchema>): Promise<boolean> => {
    const res: SelectedUser | Err = await recoverPass({ password: values.password, token })

    if (res && !res.error) {
      toast({
        title: 'Password Recovery Success',
        variant: 'success',
        description: 'Password was recovery successfully! Redirect to login page...',
      })

      setTimeout(() => (window.location.href = signInAppPath), 3000)

      return true
    } else {
      toast({ variant: 'destructive', title: 'Password Recovery Error', description: res.error.message })

      return false
    }
  }

  const fieldsData = [
    { name: 'password', label: 'Password*', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password*', type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form
        submit={onSubmit}
        schema={createPassFormTypeSchema}
        fieldsData={fieldsData}
        btn={{ text: 'Recover Password' }}
        showSpinner
        isReset
      />
    </div>
  )
}
