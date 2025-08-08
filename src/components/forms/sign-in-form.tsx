'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import z from 'zod'

import Form from './simple-form'
import OAuthBlock from '../oauth-block'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'

import { loginFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { checkTwoFa } from '@/actions/auth'
import { Err } from '@/types/errTypes'

export default function SignInForm() {
  const [code, setCode] = useState('')
  const [isTwoFa, setTwoFa] = useState(false)

  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof loginFormTypeSchema>): Promise<boolean> => {
    const res: { isTwoFa: boolean; error: null } | Err = await checkTwoFa(values.email)

    let isTwoFa = false

    if (!res.error) {
      isTwoFa = res.isTwoFa

      setTwoFa(res.isTwoFa)
    } else {
      toast({ variant: 'destructive', title: 'Two-Factor Authentication Checking Error', description: res.error.message })

      return false
    }

    if (!isTwoFa) return await login(values)
    else if (isTwoFa && !code) {
      toast({
        variant: 'warn',
        title: 'Two-Factor Authentication',
        description: 'You have enabled two-fa authentication, provide your code in appeared field...',
        duration: 7000,
      })

      return false
    } else if (isTwoFa && code) return await login({ ...values, code })
    else return false
  }

  const login = async (data: z.infer<typeof loginFormTypeSchema>): Promise<boolean> => {
    const res = await signIn('credentials', { ...data, redirect: false })

    if (res && !res?.error) {
      // window.location.href = '/'

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
    <div className="w-full">
      {isTwoFa && (
        <div className="mx-auto mb-5">
          <p className="mb-2 text-warn font-semibold">Code*</p>
          <InputOTP maxLength={6} onChange={(val) => setCode(val)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
      <Form submit={onSubmit} schema={loginFormTypeSchema} fieldsData={fieldsData} btn={{ text: 'Login' }} showLoader />
      <div className="mt-5">
        <OAuthBlock isMainPage />
      </div>
    </div>
  )
}
