'use client'

import { useEffect, useState, use } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ModalContext } from '@/contexts/modal-context'

type ComboboxProps = {
  placeholder: string
  searchText: string
  notFoundText: string
  data: { value: string; label: string; id: string }[]
  getValue?: (val: string) => void
  value?: string
}

export function Combobox({ placeholder, searchText, notFoundText, data, getValue, value: val = '' }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(val)

  const { setModalVisibility } = use(ModalContext)

  useEffect(() => {
    setModalVisibility(open)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full px-3 overflow-hidden">
          <span className="w-full truncate text-lg">
            {value ? data.find((item) => item.value === value)?.label : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] overflow-auto p-0">
        <Command>
          <CommandInput placeholder={searchText} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)

                    const id = data.find((el) => el.value === currentValue)?.id
                    getValue?.(currentValue === value ? '' : id!)
                  }}
                >
                  <span className="max-w-[400px] truncate">{item.label}</span>
                  <Check className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
