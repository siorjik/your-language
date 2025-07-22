'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

import UserMenu from './user-menu'

import logo from '@/../public/logo.png'

import { libraryAppPath, activitiesAppPath } from '@/utils/paths'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAuth = !!session

  const getMenuItem = ({ path, title }: { path: string; title: string }) => {
    let css: string = ''

    if (pathname === path || (pathname.startsWith(path) && path !== '/')) {
      css = '!border-primary'
    }

    return (
      <Link
        className={`
          px-3 border-b-[3px] border-transparent relative top-[8px] pb-[10px] ${css}
          font-balsamiqSans text-lg ${pathname !== path ? 'border-animated after:bottom-[-3px] after:left-0' : ''}
        `}
        href={path}
      >
        {title}
      </Link>
    )
  }

  const navData = [
    { title: 'Home', path: '/' },
    { title: 'Library', path: libraryAppPath },
    { title: 'Activities', path: activitiesAppPath },
  ]

  return (
    <nav className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image className="h-[43px] w-[43px] mr-10" src={logo} alt="logo" placeholder="blur" priority />
        </Link>
        {isAuth ? navData.map((item, idx) => <Fragment key={idx}>{getMenuItem(item)}</Fragment>) : getMenuItem(navData[0])}
      </div>
      <div className="flex items-center">
        <UserMenu />
      </div>
    </nav>
  )
}
