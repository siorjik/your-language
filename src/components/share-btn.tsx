'use client'

import { ReactElement, useState } from 'react'
import { getSession } from 'next-auth/react'

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

import { getSetAppPath } from '@/utils/paths'

export default function ShareBtn({
  trigger,
  id,
  isDouble = false,
  url,
}: {
  trigger: ReactElement
  id: string
  isDouble?: boolean
  url?: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isClicked, setClicked] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (isDouble) setClicked(true)

    setShowTooltip(true)

    setTimeout(() => {
      setShowTooltip(false)
      if (isDouble) setClicked(false)
    }, 3000)

    const session = await getSession()

    const sharingStr = `${window.location.host}${url ? url : getSetAppPath(id)}?creator=${session?.user.id}`

    window.navigator.clipboard.writeText(sharingStr)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip} delayDuration={!isDouble ? 10000 : 0.5}>
          <TooltipTrigger asChild>
            <div onClick={handleClick}>{trigger}</div>
          </TooltipTrigger>
          <TooltipContent>{!isClicked && isDouble ? 'Share' : 'Copied to clipboard'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
