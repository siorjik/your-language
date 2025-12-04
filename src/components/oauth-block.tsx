'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Separator } from '@/components/ui/separator'
import { Button } from './ui/button'
import Spinner from './spinner'
import GoogleIcon from './icons/google-icon'
import GithubIcon from './icons/github-icon'

import { oauthLogin } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'

export default function OAuthBlock({ isMainPage }: { isMainPage?: boolean }) {
  const [isLoading, setLoading] = useState(false)

  const { toast } = useToast()
  const t = useTranslations('oauth')

  const onSubmit = async (name: 'google' | 'github'): Promise<void> => {
    setLoading(true)

    const res = await oauthLogin(name)

    if (res.error) toast({ title: 'Authentication Error', variant: 'destructive', description: res.error.message })
    else window.location.href = res.url

    setLoading(false)
  }

  return (
    <>
      <div className="flex justify-center items-center gap-2 overflow-hidden text-primary font-semibold">
        <Separator className="bg-primary h-[2px]" />
        <span>{t('or')}</span>
        <Separator className="bg-primary h-[2px]" />
      </div>
      <Button
        variant="secondary"
        className="w-full mt-5 mb-3 text-stone-500 bg-secondary/40"
        type="submit"
        onClick={async () => await onSubmit('google')}
      >
        {t('continue')}
        <GoogleIcon />
      </Button>
      <Button
        variant="secondary"
        className="w-full text-stone-500 bg-secondary/40"
        onClick={async () => await onSubmit('github')}
      >
        {t('continue')}
        <GithubIcon />
      </Button>
      {isLoading && !isMainPage && <Spinner />}
    </>
  )
}
