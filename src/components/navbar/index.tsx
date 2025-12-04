'use client'

import { Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import UserMenu from './user-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import logo from '@/../public/logo.png'

import { libraryAppPath, activitiesAppPath, setsAppPath, classesAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)

  const pathname = usePathname()
  const { data: session } = useSession()
  const { isMobile } = useDisplayData()
  const { theme } = useTheme()
  const { getLocaleUrl } = useLocaleUrl()
  const t = useTranslations('menu')

  const isDefault = theme?.includes('-default')

  const isAuth = !!session

  const getMenuItem = ({ path, title }: { path: string; title: string }) => {
    let css: string = ''

    if (pathname === path || (pathname.startsWith(path) && path !== getLocaleUrl())) {
      css = !isMobile ? '!border-primary' : '!text-primary'
    }

    return (
      <>
        {!isMobile ? (
          <Link
            className={`
              px-3 border-b-[3px] border-transparent relative top-[8px] pb-[10px] text-primary ${css}
              font-balsamiqSans text-lg ${pathname !== path ? 'border-animated after:bottom-[-3px] after:left-0' : ''}
            `}
            href={path}
          >
            {title}
          </Link>
        ) : (
          <Link href={path} className={`w-full font-balsamiqSans text-primary/50 text-lg ${css}`}>
            {title}
          </Link>
        )}
      </>
    )
  }

  const navData = [
    { title: t('home'), path: getLocaleUrl() },
    { title: t('library'), path: getLocaleUrl(libraryAppPath) },
    { title: t('sets'), path: getLocaleUrl(setsAppPath) },
    { title: t('activities'), path: getLocaleUrl(activitiesAppPath) },
    { title: t('classes'), path: getLocaleUrl(classesAppPath) },
  ]

  return (
    <>
      <nav className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Link className="relative" href="/">
            <Image className="h-[43px] w-[43px] mr-10 z-0" src={logo} alt="logo" placeholder="blur" priority />
            {!isDefault && <div className="h-[43px] w-[43px] bg-primary/50 z-10 absolute top-0 rounded-sm" />}
          </Link>
          {!isMobile && <>{isAuth ? navData.map((item, idx) => <Fragment key={idx}>{getMenuItem(item)}</Fragment>) : null}</>}
        </div>
        {isMobile && isAuth && (
          <>
            <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
              <DropdownMenuTrigger>
                <Menu className="mr-8" onClick={() => setShowMenu(!showMenu)} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-8 text-center">
                {isAuth
                  ? navData.map((item, idx) => <DropdownMenuItem key={idx}>{getMenuItem(item)}</DropdownMenuItem>)
                  : getMenuItem(navData[0])}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <div className="flex items-center">
          <UserMenu />
        </div>
      </nav>
      {showMenu && <div className="fixed w-full h-full ml-[-20px] bg-primary/50"></div>}
    </>
  )
}
