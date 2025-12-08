'use client'

import { ReactElement, useState } from 'react'
import { getSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

import { getSetAppPath } from '@/utils/paths'
import useLocaleUrl from '@/hooks/use-locale-url'

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

  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('shareBtn')

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (isDouble) setClicked(true)

    setShowTooltip(true)

    setTimeout(() => {
      setShowTooltip(false)
      if (isDouble) setClicked(false)
    }, 3000)

    const session = await getSession()

    const sharingStr = `${window.location.host}${url ? url : getLocaleUrl(getSetAppPath(id))}?creator=${session?.user.id}`

    window.navigator.clipboard.writeText(sharingStr)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip} delayDuration={!isDouble ? 10000 : 0.5}>
          <TooltipTrigger asChild>
            <div onClick={handleClick}>{trigger}</div>
          </TooltipTrigger>
          <TooltipContent>{!isClicked && isDouble ? t('share') : t('copied')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
