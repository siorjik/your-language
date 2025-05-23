'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'

import SelectWrap from '@/components/select-wrap'
import Spinner from '@/components/spinner'

import { themes } from '@/utils/constants'

export default function ColorThemes() {
  const [isShow, setShow] = useState(false)

  const { theme, setTheme } = useTheme()

  const themeOptions = themes
    .filter((theme) => !theme.label.includes('Dark'))
    .map((theme) => ({ label: theme.label, value: theme.value }))

  const onSelectTheme = (val: string) => {
    console.log(val)
    setShow(true)

    setTimeout(() => {
      setShow(false)

      setTheme(themes.find((theme) => theme.value === val)?.value as string)
    }, 2000)
  }

  return (
    <div className="w-fit">
      {theme && (
        <div className="mb-3">
          Current theme is:{' '}
          <span className="text-primary font-semibold">{themes.find((item) => item.value === theme)?.label as string}</span>
        </div>
      )}
      <SelectWrap options={themeOptions} defaultValue="" placeholder="Choose theme" onValueChange={onSelectTheme} />
      {isShow && <Spinner />}
    </div>
  )
}
