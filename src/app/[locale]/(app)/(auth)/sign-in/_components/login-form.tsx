'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import z from 'zod'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

import Link from '@/components/link'
import Form from '@/components/forms/simple-form'
import OAuthBlock from '@/components/oauth-block'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

import { loginFormTypeSchema, recoverPassFormTypeSchema } from '@/types/forms/auth'
import { useToast } from '@/hooks/use-toast'
import { emailRecoverPassApiPath, signUpAppPath } from '@/utils/paths'
import { checkTwoFa } from '@/actions/auth'
import { Err } from '@/types/errTypes'
import DialogWrap from '@/components/dialog-wrap'
import apiRequestService from '@/services/apiRequestService'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function LoginForm() {
  const [code, setCode] = useState('')
  const [isTwoFa, setTwoFa] = useState(false)
  const [isClosed, setClose] = useState(false)

  const { toast } = useToast()
  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('form')
  const tToast = useTranslations('toast.login')
  const locale = useLocale()

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

  const recoverPass = async (values: z.infer<typeof recoverPassFormTypeSchema>): Promise<boolean> => {
    try {
      await apiRequestService({ url: emailRecoverPassApiPath, method: 'POST', body: { ...values, locale } })

      toast({
        title: tToast('recoverPass.success.title'),
        variant: 'success',
        description: tToast('recoverPass.success.description'),
      })

      setClose(true)
      setTimeout(() => setClose(false), 500)

      return true
    } catch (error) {
      const err = error as Err

      toast({ title: tToast('recoverPass.destructive.title'), variant: 'destructive', description: err.error.message })

      return false
    }
  }

  const passRecoveryForm = (
    <Form
      submit={recoverPass}
      schema={recoverPassFormTypeSchema}
      fieldsData={[{ name: 'email', label: `${t('email')}*` }]}
      btn={{ css: 'dialog-submit-btn' }}
      showLoader
      isReset
    />
  )

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
      <Form submit={onSubmit} schema={loginFormTypeSchema} fieldsData={fieldsData} btn={{ text: t('logIn') }} showSpinner />
      <DialogWrap
        title={t('passRecovery')}
        trigger={
          <p className="my-8">
            {t('forgotPass')} <span className="link">{t('passRecovery')}</span>
          </p>
        }
        content={passRecoveryForm}
        isAutoClose={isClosed}
      />
      <OAuthBlock />
      <div className="mt-8 w-fit mx-auto">
        {t.rich('goToSignUp', {
          Link1: (chunks) => (
            <Link className="link" href={'/'}>
              {chunks}
            </Link>
          ),
          Link2: (chunks) => (
            <Link className="link" href={signUpAppPath}>
              {chunks}
            </Link>
          ),
        })}
      </div>
    </div>
  )
}
