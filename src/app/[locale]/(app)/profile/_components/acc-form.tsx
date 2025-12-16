'use client'

import z from 'zod'
import { useSession, getSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import Form from '@/components/forms/simple-form'

import { updateAccFormTypeSchema } from '@/types/forms/user'
import { updateAcc } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'

export default function EditAccountForm({ isCredentials }: { isCredentials: boolean }) {
  const { toast } = useToast()
  const { data: session, update } = useSession()
  const t = useTranslations('Profile')
  const tForm = useTranslations('form')
  const tBtn = useTranslations('btn')
  const tToast = useTranslations('toast.profile.acc')

  const submit = async (data: z.infer<typeof updateAccFormTypeSchema>): Promise<boolean> => {
    await getSession()

    const res: SelectedUser | Err = await updateAcc(data)

    if (res && !res?.error) {
      toast({
        title: tToast('success.title'),
        color: 'bg-green-300',
        variant: 'success',
        description: tToast('success.description'),
      })

      update({ ...data })

      return true
    } else {
      toast({ variant: 'destructive', title: tToast('destructive.title'), description: res?.error?.message })

      return false
    }
  }

  const fieldData = [
    { name: 'email', label: `${tForm('email')}*`, disabled: !isCredentials },
    { name: 'name', label: `${tForm('name')}*` },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="sub-title-3">{t('updateAcc')}:</h3>
      <Form
        submit={submit}
        schema={updateAccFormTypeSchema}
        fieldsData={fieldData}
        btn={{ text: tBtn('update'), css: 'w-auto' }}
        data={{ email: session?.user?.email, name: session?.user?.name }}
        showLoader
      />
    </div>
  )
}
