import * as React from 'react'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectProps = {
  options: { value: string; label: string }[]
  label?: string
  onValueChange: (val?: string) => void
  defaultValue: string
  placeholder: string
  disabled?: boolean
}

export default function SelectWrap({ options, label, placeholder, defaultValue, onValueChange, disabled = false }: SelectProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue} disabled={disabled}>
      <SelectTrigger className="min-w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
