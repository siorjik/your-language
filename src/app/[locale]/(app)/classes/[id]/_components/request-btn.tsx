'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { createNotification } from '@/actions/notification'
import { NOTIFICATION_TYPES } from '@/utils/constants'
import { useToast } from '@/hooks/use-toast'

export default function RequestBtn({ classId, recipientId }: { classId: string; recipientId: string }) {
  const [disabled, setDisabled] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('Classes')
  const tToast = useTranslations('toast.requestBtn')

  const sendRequest = async () => {
    await createNotification({ classId, recipientId, type: NOTIFICATION_TYPES.sentClassJoinRequest })

    setDisabled(true)

    toast({ title: tToast('success.title'), description: tToast('success.description'), variant: 'success' })
  }

  return (
    <Button onClick={sendRequest} variant="outline" size="lg" className="btn-bg-animated text-lg" disabled={disabled}>
      {t('request')}
    </Button>
  )
}
