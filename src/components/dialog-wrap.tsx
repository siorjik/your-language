'use client'

import { ReactElement, use, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { ModalContext } from '@/contexts/modal-context'

type DialogProps = {
  trigger: ReactElement
  description?: string | null
  title: string | ReactElement
  content: ReactElement
  isAutoClose?: boolean
  width?: string
}

export default function DialogWrap({
  trigger,
  description = null,
  title,
  content,
  isAutoClose = false,
  width = '',
}: DialogProps) {
  const [isOpen, setOpen] = useState(false)

  const { setModalVisibility } = use(ModalContext)

  useEffect(() => {
    if (isAutoClose && isOpen) setOpen(false)

    setModalVisibility(isOpen)
  }, [isAutoClose, isOpen])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={`${width} gap-8`}>
          <DialogHeader>
            <DialogTitle className="text-primary">{title}</DialogTitle>
            <DialogDescription className={`text-primary/70 ${!description ? 'hidden' : ''}`}>{description}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100vh-250px)] p-1 overflow-y-auto">{content}</div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
