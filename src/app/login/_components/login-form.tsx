'use client'

import { signIn } from 'next-auth/react'
import z from 'zod'

import Form from '@/components/simple-form'

import { loginFormTypeSchema } from '@/types/forms/auth'

export default function LoginForm() {
  const onSubmit = async (values: z.infer<typeof loginFormTypeSchema>) => {
    await signIn('credentials', { ...values, redirectTo: '/' })
  }

  const fieldsData = [
    {
      name: 'email',
      label: 'Email*'
    },
    {
      name: 'password',
      label: 'Password*'
    }
  ]

  return (
    <Form
      submit={onSubmit}
      schema={loginFormTypeSchema}
      fieldsData={fieldsData}
      btnText='Login'
      showSpinner
      data={{ email: '', password: '' }}
    />
  )
}
