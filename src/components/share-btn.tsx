'use client'

import { ReactElement, useState } from 'react'
import { getSession } from 'next-auth/react'

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

import { getSetAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'

export default function ShareBtn({ trigger, id }: { trigger: ReactElement; id: string }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const { isMobile } = useDisplayData()

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    const session = await getSession()

    const sharingStr = `${window.location.host}${getSetAppPath(id)}?owner=${session?.user.email}`

    window.navigator.clipboard.writeText(sharingStr)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip
          open={showTooltip}
          onOpenChange={() => {
            if (isMobile) {
              setShowTooltip(true)

              setTimeout(() => setShowTooltip(false), 1000)
            } else setShowTooltip(!showTooltip)
          }}
          delayDuration={0.5}
        >
          <TooltipTrigger asChild>
            <div onTouchStart={() => setShowTooltip(true)} onClick={(e) => handleClick(e)}>
              {trigger}
            </div>
          </TooltipTrigger>
          <TooltipContent>Will be copied in clipboard</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
