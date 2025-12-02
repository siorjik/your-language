'use client'

import Link from 'next/link'

import useLocaleUrl from '@/hooks/use-locale-url'

export default function CustomLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const { getLocaleUrl } = useLocaleUrl()

  return (
    <Link className={className} href={getLocaleUrl(href)}>
      {children}
    </Link>
  )
}
