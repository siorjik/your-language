'use client'

import { useState, useEffect } from 'react'
import z from 'zod'
import { useSession, getSession } from 'next-auth/react'

import Form from '@/components/forms/simple-form'

import { updateAccFormTypeSchema } from '@/types/forms/user'
import { updateAcc } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'

export default function EditAccountForm() {
  const [acc, setAcc] = useState<{ name: string; email: string }>({ name: '', email: '' })

  const { toast } = useToast()
  const { data: session, update } = useSession()

  useEffect(() => {
    return () => {
      if (Object.values(acc).filter((val) => !!val).length) update({ ...acc })
    }
  }, [acc])

  const submit = async (data: z.infer<typeof updateAccFormTypeSchema>): Promise<boolean> => {
    await getSession()

    const res: SelectedUser | Err = await updateAcc(data)

    if (res && !res?.error) {
      toast({
        title: 'Account Updating',
        color: 'bg-green-300',
        variant: 'success',
        description: 'Your account was updated successfully!',
      })

      setAcc({ ...data })

      return true
    } else {
      toast({ variant: 'destructive', title: 'Account Updating Error', description: res?.error?.message })

      return false
    }
  }

  const fieldData = [
    { name: 'email', label: 'Email*' },
    { name: 'name', label: 'Name*' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="sub-title-3">Update data:</h3>
      <Form
        submit={submit}
        schema={updateAccFormTypeSchema}
        fieldsData={fieldData}
        btn={{ text: 'Update', css: 'w-auto' }}
        data={{ email: acc.email || session?.user?.email, name: acc.name || session?.user?.name }}
        showLoader
      />
    </div>
  )
}
