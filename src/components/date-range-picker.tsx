'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DateRangePicker() {
  // const [date, setDate] = React.useState<DateRange | undefined>({ from: new Date(), to: addDays(new Date(), 7) })
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)
  const [isYearView, setIsYearView] = React.useState(false)
  const [isMonthView, setIsMonthView] = React.useState(false)

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <Select
              onValueChange={(value) => {
                if (value === 'year') {
                  setIsYearView(true)
                  setIsMonthView(false)
                } else if (value === 'month') {
                  setIsMonthView(true)
                  setIsYearView(false)
                } else {
                  setIsYearView(false)
                  setIsMonthView(false)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
                <SelectItem value="year">Year View</SelectItem>
              </SelectContent>
            </Select>

            {isYearView ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => 2015 + i).map((year) => (
                  <Button
                    key={year}
                    variant="outline"
                    className={cn('h-9', date?.from?.getFullYear() === year && 'bg-primary text-primary-foreground')}
                    onClick={() => {
                      const newDate = new Date(date?.from || new Date())
                      newDate.setFullYear(year)
                      setDate({ from: newDate, to: addDays(newDate, 7) })
                    }}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            ) : isMonthView ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date()
                  date.setMonth(i)
                  return format(date, 'MMM')
                }).map((month) => (
                  <Button
                    key={month}
                    variant="outline"
                    className="h-9"
                    onClick={() => {
                      const newDate = new Date(date?.from || new Date())
                      newDate.setMonth(new Date(Date.parse(month + ' 1, 2021')).getMonth())
                      setDate({ from: newDate, to: addDays(newDate, 7) })
                    }}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            ) : (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="rounded-md border"
              />
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDate(undefined)
                  setIsYearView(false)
                  setIsMonthView(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle apply logic here
                  console.log('Applied date range:', date)
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
