'use client'

import z from 'zod'

import Form from '@/components/simple-form'

import { createPassFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { createPass } from '@/actions/auth'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import { signInAppPath } from '@/utils/paths'

export default function CreatePasswordForm({ token }: { token: string | '' }) {
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof createPassFormTypeSchema>): Promise<boolean> => {
    const res: SelectedUser | Err = await createPass({ password: values.password, token })

    if (!('error' in res)) {
      toast({ title: 'Password Creating Success', description: 'Password was created successfully! Redirect to login page...' })

      setTimeout(() => (window.location.href = signInAppPath), 3000)

      return true
    } else {
      toast({ variant: 'destructive', title: 'Password Creation Error', description: res.error.message })

      return false
    }
  }

  const fieldsData = [
    { name: 'password', label: 'Password*', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password*', type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form submit={onSubmit} schema={createPassFormTypeSchema} fieldsData={fieldsData} btnText="Login" showSpinner />
    </div>
  )
}
