'use client'

import { ReactElement } from 'react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { Langs } from '@/types/speech'

type DropdownMenu = {
  soundMode: { term: boolean, definition: boolean }
  setSoundMode: (soundMode: { term: boolean, definition: boolean }) => void,
  isShowDropdownMenu: boolean,
  setShowDropdownMenu: (isShow: boolean) => void,
  trigger: ReactElement,
  dataSource: Langs,
  dataTarget: Langs
}

export default function DropdownMenuComp({
  soundMode, setSoundMode, isShowDropdownMenu, setShowDropdownMenu, trigger, dataSource, dataTarget }: DropdownMenu
) {
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
          <DropdownMenuLabel>Speech mode:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={soundMode.term}
            onCheckedChange={() => setSoundMode({ ...soundMode, term: !soundMode.term })}
          >
            {`Term (${LANGUAGE_OPTIONS.find((item) => dataSource === item.value)?.label})`}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={soundMode.definition}
            onCheckedChange={() => setSoundMode({ ...soundMode, definition: !soundMode.definition })}
          >
            {`Definition (${LANGUAGE_OPTIONS.find((item) => dataTarget === item.value)?.label})`}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
