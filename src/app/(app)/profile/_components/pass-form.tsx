'use client'

import z from 'zod'
import { getSession } from 'next-auth/react'

import Form from '@/components/forms/simple-form'

import { changePassFormTypeSchema } from '@/types/forms/user'
import { updatePass } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { Err } from '@/types/errTypes'

export default function EditAccountForm() {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof changePassFormTypeSchema>): Promise<boolean> => {
    await getSession()

    const res: { success: true; error: null } | Err = await updatePass(data)

    if (res && !res?.error) {
      toast({ title: 'Password Updating', variant: 'success', description: 'Your password was updated successfully!' })

      return true
    } else {
      toast({ variant: 'destructive', title: 'Password Updating Error', description: res.error.message })

      return false
    }
  }

  const fieldData = [
    { name: 'currentPass', label: 'Current Password*', type: 'password' },
    { name: 'newPass', label: 'New Password*', type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form
        submit={submit}
        schema={changePassFormTypeSchema}
        fieldsData={fieldData}
        btn={{ text: 'Update', css: 'w-auto' }}
        isReset
        showLoader
      />
    </div>
  )
}
