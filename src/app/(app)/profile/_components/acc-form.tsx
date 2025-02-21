'use client'

import z from 'zod'
import { useSession } from 'next-auth/react'

import Form from '@/components/forms/simple-form'

import { updateAccFormTypeSchema } from '@/types/forms/user'
import { updateAcc } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'

export default function EditAccountForm() {
  const { toast } = useToast()
  const { data: session, update } = useSession()

  const submit = async (data: z.infer<typeof updateAccFormTypeSchema>): Promise<boolean> => {
    const res: SelectedUser | Err = await updateAcc(data)

    if (!('error' in res)) {
      toast({ title: 'Account Updating', description: 'Your account was updated successfully!' })

      update({ ...data })

      return true
    } else {
      toast({ variant: 'destructive', title: 'Account Updating Error', description: res.error.message })

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
        schema={updateAccFormTypeSchema}
        fieldsData={fieldData}
        btn={{ text: 'Update', css: 'w-auto' }}
        data={{ email: session?.user?.email, name: session?.user?.name }}
        showSpinner
      />
    </div>
  )
}
