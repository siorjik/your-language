'use client'

import { memo, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
  cb: (date: Date | undefined) => void
  disabledDate?: { value: Date; lessMore: 'less' | 'more' }
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(dateVal || undefined)

  const t = useTranslations('datePicker')

  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="w-48 justify-between font-normal" disabled={disabled}>
              {date ? date.toLocaleDateString() : t('select')}
              <div className="flex items-center gap-2">
                <ChevronDownIcon />
                {date && (
                  <span
                    className="pb-1"
                    onClick={(e) => {
                      e.preventDefault()

                      setDate(undefined)

                      cb(undefined)
                    }}
                  >
                    x
                  </span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
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
