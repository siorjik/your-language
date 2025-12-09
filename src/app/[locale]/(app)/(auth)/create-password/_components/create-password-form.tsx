'use client'

import z from 'zod'

import Form from '@/components/forms/simple-form'
import { useTranslations } from 'next-intl'

import { createPassFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { createPass } from '@/actions/auth'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import { signInAppPath } from '@/utils/paths'

export default function CreatePasswordForm({ token }: { token: string | '' }) {
  const { toast } = useToast()
  const t = useTranslations('form')

  const onSubmit = async (values: z.infer<typeof createPassFormTypeSchema>): Promise<boolean> => {
    const res: SelectedUser | Err = await createPass({ password: values.password, token })

    if (res && !res.error) {
      toast({
        title: 'Password Creating Success',
        variant: 'success',
        description: 'Password was created successfully! Redirect to login page...',
      })

      setTimeout(() => (window.location.href = signInAppPath), 3000)

      return true
    } else {
      toast({ variant: 'destructive', title: 'Password Creation Error', description: res.error.message })

      return false
    }
  }

  const fieldsData = [
    { name: 'password', label: `${t('password')}*`, type: 'password' },
    { name: 'confirmPassword', label: `${t('confirmPass')}*`, type: 'password' },
  ]

  return (
    <Form
      submit={onSubmit}
      schema={createPassFormTypeSchema}
      fieldsData={fieldsData}
      btn={{ text: t('createPass') }}
      showSpinner
      isReset
    />
  )
}
