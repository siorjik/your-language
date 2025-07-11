'use client'

import { useEffect, useState } from 'react'
import { Settings, UserRoundCog, LogOut, UserRoundPlus, LogIn, Palette } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { profileAppPath, signUpAppPath, signInAppPath } from '@/utils/paths'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../ui/navigation-menu'
import ThemeBtn from '../theme-btn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'

import useFileStorage from '@/hooks/useFileStorage'
import { THEMES } from '@/utils/constants'
import Spinner from '../spinner'

export default function UserMenu() {
  const [isShow, setShow] = useState(false)
  const [menuValue, setMenuValue] = useState<string | undefined>(undefined)
  const [showLoader, setShowLoader] = useState(false)

  const { data: session } = useSession()
  const { getAuthUrl } = useFileStorage()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (isShow && !menuValue) setMenuValue('menu')
  }, [isShow, menuValue])

  const logOut = async () => {
    if (window.localStorage.getItem('tab')) window.localStorage.removeItem('tab')

    await signOut({ redirectTo: '/' })
  }

  const changeTheme = (val: string) => {
    if (theme === val) return

    setShowLoader(true)

    setTimeout(() => {
      setTheme(val)

      setMenuValue('')
      setShowLoader(false)
    }, 1000)
  }

  const dropdownMenu = () => (
    <DropdownMenu open={isShow} onOpenChange={setShow}>
      <DropdownMenuTrigger asChild>
        <span className="flex items-center gap-3 h-10 px-2 hover:bg-accent cursor-pointer rounded-md font-semibold w-full">
          <Palette className="text-primary" />
          <span className="text-primary">Colors</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuLabel>Theme Colors</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme?.replace('-dark', '')} onValueChange={(val) => changeTheme(val)}>
          {THEMES.filter((el) => !el.value.includes('-dark')).map((el, idx) => (
            <DropdownMenuRadioItem value={el.value} key={idx}>
              {el.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {session?.user ? (
        <NavigationMenu className="profile-menu" value={menuValue} onValueChange={setMenuValue}>
          <NavigationMenuList>
            <NavigationMenuItem value="menu" className="h-[43px] mt-1">
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
                      className="px-2 h-10 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md font-semibold"
                      href={profileAppPath}
                    >
                      <UserRoundCog className="text-primary" />
                      <span className="text-primary">Settings</span>
                    </Link>
                  </NavigationMenuLink>
                )}
                <NavigationMenuLink onSelect={(e) => e.preventDefault()} asChild>
                  <span
                    onClick={() => setMenuValue('menu')}
                    className="h-10 px-2 hover:bg-accent flex items-center cursor-pointer rounded-md font-semibold"
                  >
                    <ThemeBtn text="Mode" />
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>{dropdownMenu()}</NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <span
                    className="h-10 px-2 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md font-semibold"
                    onClick={logOut}
                  >
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
      )}
      {showLoader && <Spinner />}
    </>
  )
}
