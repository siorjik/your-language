'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import Spinner from '@/components/spinner'

import apiRequestService from '@/services/apiRequestService'
import { profileAppPath, twoFaVerifyApiPath } from '@/utils/paths'
import { updateAccTwoFaHash } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function TwoFa({ twoFaData }: { twoFaData: { data: string; secret: string } | null }) {
  const [isShow, setShow] = useState(false)

  const { toast } = useToast()
  const { push } = useRouter()
  const { update } = useSession()
  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('Profile')
  const tBtn = useTranslations('btn')

  const getErrToast = (description: string) =>
    toast({ title: 'Two-Factor Authentication Error', variant: 'destructive', description })

  const setCode = (val: string): void => {
    if (val.length === 6) onSubmit(val)
  }

  const onSubmit = async (code: string): Promise<void> => {
    setShow(true)

    try {
      const res: { verified: boolean } = await apiRequestService({
        url: twoFaVerifyApiPath,
        method: 'POST',
        body: { secret: twoFaData?.secret as string, code },
      })

      if (res.verified) {
        const res = await updateAccTwoFaHash({ secret: twoFaData?.secret as string })

        if (res.error) getErrToast(res.error.message)

        update({ isTwoFa: true })

        setTimeout(() => push(getLocaleUrl(profileAppPath)), 100)
      } else getErrToast('Invalid code, please repeat...')

      setShow(false)
    } catch (error) {
      console.log(error)
    }
  }

  const disableTwoFaHash = async () => {
    setShow(true)

    const res = await updateAccTwoFaHash({ secret: null })

    if (res.error) getErrToast(res.error.message)

    update({ isTwoFa: false })

    setTimeout(() => push(getLocaleUrl(profileAppPath)), 100)
  }

  return (
    <>
      <h3 className="sub-title-3">{t('two-fa.title')}:</h3>
      {twoFaData ? (
        <div>
          <Image className="mb-10 rounded-md" width={150} height={150} src={twoFaData?.data} alt="qr-code" />
          <p className="mb-2 text-primary font-semibold">{t('two-fa.first')}</p>
          <p className="mb-10 text-primary font-semibold">{t('two-fa.second')}</p>
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
          <div className="mt-10 font-semibold text-primary">{t('two-fa.next')}</div>
        </div>
      ) : (
        <>
          <p className="mb-5 text-success font-semibold">{t('two-fa.enabled')}</p>
          <Button variant="warn" onClick={disableTwoFaHash}>
            {tBtn('disable')}
          </Button>
        </>
      )}
      {isShow && <Spinner />}
    </>
  )
}
