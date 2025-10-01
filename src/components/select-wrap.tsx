import { use, useEffect, useState } from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ModalContext } from '@/contexts/modal-context'

type SelectProps = {
  options: { value: string; label: string }[]
  label?: string
  onValueChange: (val: string) => void
  defaultValue: string
  placeholder: string
  disabled?: boolean
}

export default function SelectWrap({ options, label, placeholder, defaultValue, onValueChange, disabled = false }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { setModalVisibility } = use(ModalContext)

  useEffect(() => {
    setModalVisibility('select', isOpen)
  }, [isOpen])

  return (
    <Select open={isOpen} onOpenChange={setIsOpen} onValueChange={onValueChange} defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger className="min-w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={option.value} onKeyDown={(e) => e.key === ' ' && e.preventDefault()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
