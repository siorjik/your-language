'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import Spinner from '@/components/spinner'

import apiRequestService from '@/services/apiRequestService'
import { profileAppPath, twoFaVerifyApiPath } from '@/utils/paths'
import { updateAccTwoFaHash } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'

export default function TwoFa({ twoFaData }: { twoFaData: { data: string; secret: string } | null }) {
  const [isShow, setShow] = useState(false)

  const { toast } = useToast()
  const { push } = useRouter()

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

        push(profileAppPath)
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

    setShow(false)

    push(profileAppPath)
  }

  return (
    <>
      {twoFaData ? (
        <div>
          <Image className="mb-10 rounded-md" width={150} height={150} src={twoFaData?.data} alt="qr-code" />
          <p className="mb-2">1 - scan the QR Code with your Authenticator app</p>
          <p className="mb-10">2 - enter the code below from your app</p>
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
      ) : (
        <>
          <p className="mb-5 text-success font-semibold">Two-Factor authentication is enabled!</p>
          <Button variant="warn" onClick={disableTwoFaHash}>
            Disable
          </Button>
        </>
      )}
      {isShow && <Spinner />}
    </>
  )
}
