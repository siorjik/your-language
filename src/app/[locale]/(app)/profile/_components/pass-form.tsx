'use client'

import z from 'zod'
import { getSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Form from '@/components/forms/simple-form'

import { changePassFormTypeSchema } from '@/types/forms/user'
import { updatePass } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { Err } from '@/types/errTypes'

export default function EditAccountForm() {
  const { toast } = useToast()
  const t = useTranslations('Profile')
  const tForm = useTranslations('form')
  const tBtn = useTranslations('btn')
  const tToast = useTranslations('toast.profile.pass')

  const submit = async (data: z.infer<typeof changePassFormTypeSchema>): Promise<boolean> => {
    await getSession()

    const res: { success: true; error: null } | Err = await updatePass(data)

    if (res && !res?.error) {
      toast({ title: tToast('success.title'), variant: 'success', description: tToast('success.description') })

      return true
    } else {
      toast({ variant: 'destructive', title: tToast('destructive.title'), description: res.error.message })

      return false
    }
  }

  const fieldData = [
    { name: 'currentPass', label: `${tForm('currentPass')}*`, type: 'password' },
    { name: 'newPass', label: `${tForm('newPass')}*`, type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="sub-title-3">{t('updatePass')}:</h3>
      <Form
        submit={submit}
        schema={changePassFormTypeSchema}
        fieldsData={fieldData}
        btn={{ text: tBtn('update'), css: 'w-auto' }}
        isReset
        showLoader
      />
    </div>
  )
}
