'use client'

import { memo, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './ui/button'

export default memo(function DatePicker({
  label,
  cb,
  date: dateVal,
  disabledDate,
  disabled = false,
}: {
  label: string
  date: Date | undefined
  cb: (date: Date) => void
  disabledDate?: { value: Date; lessMore: 'less' | 'more' }
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(dateVal || undefined)

  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="w-48 justify-between font-normal" disabled={disabled}>
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              disabled={(date) => {
                return disabledDate?.lessMore === 'less' ? date < disabledDate.value : date > disabledDate!.value
              }}
              onSelect={(date) => {
                cb(date!)

                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
})
