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
      css = '!border-primary'
    }

    return (
      <Link
        className={`
          px-2 border-b-[3px] border-transparent font-semibold hover:border-accent relative top-[8px] pb-[17px] ${css}
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
          <NavigationMenuTrigger className="px-0 bg-header">
            {!session.user.image ? (
              <Settings className="text-muted-foreground" />
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
          <NavigationMenuContent className="flex flex-col">
            {session.user.isCredentials && (
              <NavigationMenuLink asChild>
                <Link className="w-full py-2 px-3 hover:bg-accent" href={profileAppPath}>
                  <UserRoundCog className="mx-auto text-muted-foreground" />
                </Link>
              </NavigationMenuLink>
            )}
            <NavigationMenuLink asChild>
              <span className="py-2 px-3 hover:bg-accent">
                <ThemeBtn />
              </span>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <span className="w-full py-2 px-3 hover:bg-accent">
                <LogOut onClick={logOut} className="mx-auto text-muted-foreground" />
              </span>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ) : (
    <div className="flex gap-2">
      <Link href={signUpAppPath}>
        <UserRoundPlus className="text-muted-foreground" />
      </Link>
      <Link href={signInAppPath}>
        <LogIn className="text-muted-foreground" />
      </Link>
    </div>
  )

  const navData = [
    { title: 'Home', path: '/' },
    // { title: 'Profile', path: '/profile' },
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
