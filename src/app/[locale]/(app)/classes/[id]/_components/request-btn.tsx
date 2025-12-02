'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { createNotification } from '@/actions/notification'
import { NOTIFICATION_TYPES } from '@/utils/constants'
import { useToast } from '@/hooks/use-toast'

export default function RequestBtn({ classId, recipientId }: { classId: string; recipientId: string }) {
  const [disabled, setDisabled] = useState(false)
  const { toast } = useToast()

  const sendRequest = async () => {
    await createNotification({ classId, recipientId, type: NOTIFICATION_TYPES.sentClassJoinRequest })

    setDisabled(true)

    toast({ title: 'Join Request Sending', description: 'Your request was sent successfully!', variant: 'success' })
  }

  return (
    <Button onClick={sendRequest} variant="outline" size="lg" className="btn-bg-animated text-lg" disabled={disabled}>
      Send request to join to the Class
    </Button>
  )
}
