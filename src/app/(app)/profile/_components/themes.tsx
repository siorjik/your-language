'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'

import SelectWrap from '@/components/select-wrap'
import Spinner from '@/components/spinner'

import { THEMES } from '@/utils/constants'

export default function ColorThemes() {
  const [isShow, setShow] = useState(false)

  const { theme, setTheme } = useTheme()

  const themeOptions = THEMES.filter((theme) => !theme.label.includes('Dark')).map((theme) => ({
    label: theme.label,
    value: theme.value,
  }))

  const onSelectTheme = (val: string) => {
    if (val === theme) return

    setShow(true)

    setTimeout(() => {
      setShow(false)

      setTheme(THEMES.find((theme) => theme.value === val)?.value as string)
    }, 1000)
  }

  return (
    <div className="w-fit">
      <h3 className="sub-title-3">Choose your color theme:</h3>
      {theme && (
        <SelectWrap
          options={themeOptions}
          defaultValue={theme?.includes('-dark') ? theme.replaceAll('-dark', '') : theme}
          placeholder="Choose color"
          onValueChange={onSelectTheme}
        />
      )}
      {isShow && <Spinner />}
    </div>
  )
}
