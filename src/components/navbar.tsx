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

import { signInAppPath, signUpAppPath, profileAppPath, libraryAppPath, activitiesAppPath } from '@/utils/paths'
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
          px-3 border-b-[3px] border-transparent relative top-[10px] pb-[13px] ${css}
          font-montserrat font-medium text-md ${pathname !== path ? 'border-animated after:bottom-[-3px] after:left-0' : ''}
        `}
        href={path}
      >
        {title}
      </Link>
    )
  }

  const userMenu = session?.user ? (
    <NavigationMenu className="profile-menu">
      <NavigationMenuList>
        <NavigationMenuItem className="h-[43px] mt-1">
          <NavigationMenuTrigger className="px-0 bg-background">
            {!session.user.image ? (
              <Settings className="text-muted-foreground" />
            ) : (
              <Image
                className="h-[43px] w-[43px] rounded-full object-cover"
                src={getAuthUrl(session.user.image)}
                width={30}
                height={30}
                alt="image"
                priority
              />
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-1 pr-[6px] pb-[6px] flex flex-col">
            {session.user.isCredentials && (
              <NavigationMenuLink asChild>
                <Link
                  className="px-2 h-10 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md"
                  href={profileAppPath}
                >
                  <UserRoundCog className="text-primary" />
                  <span className="text-primary">Settings</span>
                </Link>
              </NavigationMenuLink>
            )}
            <NavigationMenuLink asChild>
              <span className="my-1 h-10 px-2 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md">
                <ThemeBtn />
                <span className="text-primary">Mode</span>
              </span>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <span className="h-10 px-2 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md" onClick={logOut}>
                <LogOut className="text-primary" />
                <span className="whitespace-nowrap text-primary">Log Out</span>
              </span>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ) : (
    <div className="flex">
      <Link href={signUpAppPath}>
        <span className="icon-hover">
          <UserRoundPlus />
        </span>
      </Link>
      <Link href={signInAppPath}>
        <span className="icon-hover mr-[-8px]">
          <LogIn />
        </span>
      </Link>
    </div>
  )

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
      <div className="flex items-center">{userMenu}</div>
    </nav>
  )
}
