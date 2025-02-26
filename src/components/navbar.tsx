'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRoundCog, LogOut, Settings, UserRoundPlus, LogIn } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import ThemeBtn from './theme-btn'

import logo from '@/../public/logo.png'

import { signInAppPath, signUpAppPath, profileAppPath } from '@/utils/paths'
import useFileStorage from '@/hooks/useFileStorage'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { getAuthUrl } = useFileStorage()

  const isAuth = !!session

  const logOut = async () => {
    if (window.localStorage.getItem('tab')) window.localStorage.removeItem('tab')

    await signOut({ redirectTo: '/' })
  }

  const getMenuItem = ({ path, title }: { path: string; title: string }) => {
    let css: string = ''

    if (pathname === path || (pathname.startsWith(path) && path !== '/')) {
      css = '!border-stone-500 dark:!border-yellow-500'
    }

    return (
      <Link
        className={`
          px-2 border-b-[3px] border-transparent font-semibold hover:border-stone-300
          dark:hover:border-stone-500 relative top-[8px] pb-[17px] ${css}
        `}
        href={path}
      >
        {title}
      </Link>
    )
  }

  const userMenu = session?.user ? (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-0 bg-stone-50 dark:bg-stone-900">
            {!session.user.image ? (
              <Settings className="text-gray-500 dark:text-foreground" />
            ) : (
              <Image
                className="h-[40px] w-[40px] rounded-full object-cover"
                src={getAuthUrl(session.user.image)}
                width={30}
                height={30}
                alt="image"
                priority
              />
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-3 flex flex-col gap-3 text-current">
            <NavigationMenuLink asChild>
              <Link className="flex items-center gap-2" href={profileAppPath}>
                <UserRoundCog className="text-gray-500 dark:text-foreground" />
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <ThemeBtn />
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <LogOut onClick={logOut} className="text-gray-500 dark:text-foreground" />
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ) : (
    <div className="flex gap-2">
      <Link href={signUpAppPath}>
        <UserRoundPlus className="text-gray-500 dark:text-foreground" />
      </Link>
      <Link href={signInAppPath}>
        <LogIn className="text-gray-500 dark:text-foreground" />
      </Link>
    </div>
  )

  const navData = [
    { title: 'Home', path: '/' },
    { title: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image className="h-[40px] w-[40px] mr-10 relative bottom-[1px]" src={logo} alt="logo" placeholder="blur" priority />
        </Link>
        {isAuth ? navData.map((item, idx) => <Fragment key={idx}>{getMenuItem(item)}</Fragment>) : getMenuItem(navData[0])}
      </div>
      <div className="flex items-center">{userMenu}</div>
    </nav>
  )
}
