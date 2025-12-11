'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

import SelectWrap from '@/components/select-wrap'
import Spinner from '@/components/spinner'

import { THEMES } from '@/utils/constants'

export default function ColorThemes() {
  const [isShow, setShow] = useState(false)

  const { theme, setTheme } = useTheme()
  const t = useTranslations('Profile')

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
      <h3 className="sub-title-3">{t('chooseTheme')}:</h3>
      {theme && (
        <SelectWrap
          options={themeOptions}
          defaultValue={theme?.includes('-dark') ? theme.replaceAll('-dark', '') : theme}
          placeholder={t('chooseColor')}
          onValueChange={onSelectTheme}
        />
      )}
      {isShow && <Spinner />}
    </div>
  )
}
