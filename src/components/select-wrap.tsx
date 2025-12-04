import { use, useEffect, useState } from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ModalContext } from '@/contexts/modal-context'

type SelectProps = {
  options: { value: string; label: string; hidden?: boolean }[]
  label?: string
  onValueChange: (val: string) => void
  defaultValue: string
  placeholder: string
  disabled?: boolean
  css?: string
}

export default function SelectWrap({
  options,
  label,
  placeholder,
  defaultValue,
  onValueChange,
  disabled = false,
  css = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { setModalVisibility } = use(ModalContext)

  useEffect(() => {
    setModalVisibility('select', isOpen)
  }, [isOpen])

  return (
    <Select open={isOpen} onOpenChange={setIsOpen} onValueChange={onValueChange} defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger className={`min-w-[180px] ${css}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option, idx) => {
            if (option.hidden) return null

            return (
              <SelectItem key={idx} value={option.value} onKeyDown={(e) => e.key === ' ' && e.preventDefault()}>
                {option.label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
