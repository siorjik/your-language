'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import z from 'zod'
import useLocaleUrl from '@/hooks/use-locale-url'
import { useTranslations } from 'next-intl'

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
  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('form')
  const tToast = useTranslations('toast.login')

  const onSubmit = async (values: z.infer<typeof loginFormTypeSchema>): Promise<boolean> => {
    const res: { isTwoFa: boolean; error: null } | Err = await checkTwoFa(values.email)

    let isTwoFa = false

    if (!res.error) {
      isTwoFa = res.isTwoFa

      setTwoFa(res.isTwoFa)
    } else {
      toast({ variant: 'destructive', title: tToast('twoFa.destructive.title'), description: res.error.message })

      return false
    }

    if (!isTwoFa) return await login(values)
    else if (isTwoFa && !code) {
      toast({ variant: 'warn', title: tToast('twoFa.warn.title'), description: tToast('twoFa.warn.description'), duration: 7000 })

      return false
    } else if (isTwoFa && code) return await login({ ...values, code })
    else return false
  }

  const login = async (data: z.infer<typeof loginFormTypeSchema>): Promise<boolean> => {
    const res = await signIn('credentials', { ...data, redirect: false })

    if (res && !res?.error) {
      window.location.href = getLocaleUrl()

      return true
    } else {
      toast({ variant: 'destructive', title: tToast('destructive.title'), description: res?.code })

      return false
    }
  }

  const fieldsData = [
    { name: 'email', label: `${t('email')}*` },
    { name: 'password', label: `${t('password')}*`, type: 'password' },
  ]

  return (
    <div className="w-full">
      {isTwoFa && (
        <div className="mx-auto mb-5">
          <p className="mb-2 text-warn font-semibold">{t('code')}*</p>
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
      <Form submit={onSubmit} schema={loginFormTypeSchema} fieldsData={fieldsData} btn={{ text: t('logIn') }} showLoader />
      <div className="mt-5">
        <OAuthBlock isMainPage />
      </div>
    </div>
  )
}
