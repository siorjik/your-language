'use client'

import z from 'zod'

import Form from '@/components/forms/simple-form'

import { changePassFormTypeSchema } from '@/types/forms/user'
import { updatePass } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { Err } from '@/types/errTypes'

export default function EditAccountForm() {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof changePassFormTypeSchema>): Promise<boolean> => {
    const res: { success: true } | Err = await updatePass(data)

    if (!('error' in res)) {
      toast({ title: 'Password Updating', description: 'Your password was updated successfully!' })

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
        showSpinner
      />
    </div>
  )
}
