'use client'

import { useState } from 'react'

import { Separator } from '@/components/ui/separator'
import { Button } from './ui/button'
import Spinner from './spinner'

import { oauthLogin } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'

export default function OAuthBlock({ isMainPage }: { isMainPage?: boolean }) {
  const [isLoading, setLoading] = useState(false)

  const { toast } = useToast()

  const onSubmit = async (name: 'google' | 'github'): Promise<void> => {
    setLoading(true)

    const res = await oauthLogin(name)

    if (res.error) toast({ title: 'Authentication Error', variant: 'destructive', description: res.error.message })
    else window.location.href = res.url

    setLoading(false)
  }

  return (
    <>
      <div className="flex justify-center items-center gap-2 overflow-hidden">
        <Separator className="bg-foreground" />
        OR
        <Separator className="bg-foreground" />
      </div>
      <Button
        variant="secondary"
        className="w-full mt-5 mb-3 text-stone-500 bg-secondary/40"
        type="submit"
        onClick={async () => await onSubmit('google')}
      >
        Continue with <span className="font-semibold">Google</span>
      </Button>
      <Button
        variant="secondary"
        className="w-full text-stone-500 bg-secondary/40"
        onClick={async () => await onSubmit('github')}
      >
        Continue with <span className="font-semibold">Github</span>
      </Button>
      {isLoading && !isMainPage && <Spinner />}
    </>
  )
}
