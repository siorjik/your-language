'use client'

import { memo, ReactElement, ReactNode } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DropdownMenuProps = {
  isShowDropdownMenu: boolean
  setShowDropdownMenu: (isShow: boolean) => void
  trigger: ReactElement
  items: ReactNode[]
  title: string
}

export default memo(function DropdownMenuComp({
  items,
  isShowDropdownMenu,
  setShowDropdownMenu,
  trigger,
  title,
}: DropdownMenuProps) {
  return (
    <>
      <DropdownMenu open={isShowDropdownMenu} onOpenChange={setShowDropdownMenu}>
        <DropdownMenuTrigger
          asChild
          onMouseEnter={() => {
            setShowDropdownMenu(true)

            document.body.style.pointerEvents = 'auto' // avoiding drop menu flickering
          }}
          onMouseLeave={() => (document.body.style.pointerEvents = 'auto')} // avoiding drop menu flickering
        >
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2" onMouseLeave={() => setShowDropdownMenu(false)}>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
})
