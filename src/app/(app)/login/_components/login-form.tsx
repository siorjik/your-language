'use client'

import { signIn } from 'next-auth/react'
import z from 'zod'

import Form from '@/components/simple-form'

import { loginFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'

export default function LoginForm() {
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof loginFormTypeSchema>) => {
    const res = await signIn('credentials', { ...values, redirect: false })

    if (!res?.error) window.location.href = '/'
    else {
      toast({ variant: 'destructive', title: 'Login Error', description: res.code })
    }
  }

  const fieldsData = [
    { name: 'email', label: 'Email*' },
    { name: 'password', label: 'Password*', type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form
        submit={onSubmit}
        schema={loginFormTypeSchema}
        fieldsData={fieldsData}
        btnText="Login"
        showSpinner
        data={{ email: '', password: '' }}
      />
    </div>
  )
}
