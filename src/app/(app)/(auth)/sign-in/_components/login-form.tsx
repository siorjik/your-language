'use client'

import { signIn } from 'next-auth/react'
import z from 'zod'
import Link from 'next/link'

import Form from '@/components/forms/simple-form'

import { loginFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { signUpAppPath } from '@/utils/paths'

export default function LoginForm() {
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof loginFormTypeSchema>): Promise<boolean> => {
    const res = await signIn('credentials', { ...values, redirect: false })

    if (res && !res?.error) {
      window.location.href = '/'

      return true
    } else {
      toast({ variant: 'destructive', title: 'Login Error', description: res?.code })

      return false
    }
  }

  const fieldsData = [
    { name: 'email', label: 'Email*' },
    { name: 'password', label: 'Password*', type: 'password' },
  ]

  return (
    <div className="w-full max-w-[350px]">
      <Form submit={onSubmit} schema={loginFormTypeSchema} fieldsData={fieldsData} btn={{ text: 'Login' }} showSpinner />
      <div className="mt-8 w-fit mx-auto">
        Go to{' '}
        <Link className="link" href="/">
          Home
        </Link>
        {' or '}
        <Link className="link" href={signUpAppPath}>
          Sign Up
        </Link>{' '}
        page
      </div>
    </div>
  )
}
