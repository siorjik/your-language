'use client'

import { useEffect, useState } from 'react'
import { Settings, UserRoundCog, LogOut, UserRoundPlus, LogIn, Palette, Bell, BellDot, Trash2, Check, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { formatDistanceToNow } from 'date-fns'
import { useLocale } from 'next-intl'

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
import Spinner from '../spinner'

import { profileAppPath, signUpAppPath, signInAppPath, getSetAppPath, getClassAppPath, contactUsAppPath } from '@/utils/paths'
import { NOTIFICATION_STATUSES, NOTIFICATION_TYPES, SOCKET_EVENTS, THEMES } from '@/utils/constants'
import { Notification } from '@prisma/client'
import { createNotification, deleteNotification, getUserNotifications, readNotification } from '@/actions/notification'
import useSocket from '@/hooks/useSocket'
import { Button } from '../ui/button'
import { getClassById, updateClass } from '@/actions/class'
import { SelectedClass } from '@/types/models/class'
import { Err } from '@/types/errTypes'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function UserMenu() {
  const [isShow, setShow] = useState(false)
  const [menuValue, setMenuValue] = useState<string | undefined>(undefined)
  const [showLoader, setShowLoader] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationList, setNotificationList] = useState<Notification[]>([])

  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const { getLocaleUrl } = useLocaleUrl()

  useSocket(SOCKET_EVENTS.notification, () => {
    setTimeout(async () => await getNotifications(), 500)
  })

  useEffect(() => {
    if (session?.user) {
      ;(async () => {
        await getNotifications()
      })()
    }
  }, [session])

  useEffect(() => {
    if ((isShow || showNotifications) && !menuValue) setMenuValue('menu')
  }, [isShow, showNotifications, menuValue])

  const logOut = async () => {
    if (window.localStorage.getItem('tab')) window.localStorage.removeItem('tab')

    await signOut({ redirectTo: `/${locale}` })
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

  const onRequestAnswer = async (action: 'approve' | 'reject', notification: Notification) => {
    try {
      if (action === 'approve') {
        const res: (SelectedClass & { error: null }) | Err = await getClassById(notification.classId!)

        if (!res.error) {
          const { id, title, users, sets } = res

          await updateClass({ id, title, sets, users: [...users, notification.userId!] })
        } else throw res.error

        await createNotification({
          userId: notification.recipientId,
          recipientId: notification.userId,
          type: NOTIFICATION_TYPES.approvedClassJoinRequest,
          classId: notification.classId!,
        })

        await handleNotification(notification.id, 'read')
      } else await handleNotification(notification.id, 'read')
    } catch (error) {
      console.log(error)
    }
  }

  const getNotificationMessage = (notification: Notification) => {
    const time = <p className="mb-2 text-xs text-primary">{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
    switch (notification.type) {
      case NOTIFICATION_TYPES.createdSet:
        return (
          <div>
            {time}
            <p>
              <span className="font-emoji">😉</span> Hi there! Your new created{' '}
              <Link className="link inline-block" href={getSetAppPath(notification.setId!)}>
                Set
              </Link>{' '}
              is waiting for you!
            </p>
          </div>
        )

      case NOTIFICATION_TYPES.createdClass:
        return (
          <div>
            {time}
            <p>
              <span className="font-emoji">👨‍🏫</span> Invite friends in your created{' '}
              <Link className="link inline-block" href={getClassAppPath(notification.classId!)}>
                Class
              </Link>{' '}
              and have fun!
            </p>
          </div>
        )

      case NOTIFICATION_TYPES.sentClassJoinRequest:
        return (
          <div>
            {time}
            <p>
              <span className="font-emoji">👨‍🎓👩‍🎓</span> You got the request to join your{' '}
              <Link className="link inline-block" href={getClassAppPath(notification.classId!)}>
                Class
              </Link>
              !
            </p>
            {notification.status === NOTIFICATION_STATUSES.new && (
              <div className="mt-2 flex flex-col md:flex-row gap-2 justify-center">
                <Button className="h-5 text-xs p-2 pb-[10px]" onClick={() => onRequestAnswer('approve', notification)} size="sm">
                  Approve
                </Button>
                <Button className="h-5 text-xs p-2 pb-[10px]" onClick={() => onRequestAnswer('reject', notification)} size="sm">
                  Reject
                </Button>
              </div>
            )}
          </div>
        )

      case NOTIFICATION_TYPES.approvedClassJoinRequest:
        return (
          <div>
            {time}
            <p>
              <span className="font-emoji">🥳</span> You were joined the{' '}
              <Link className="link inline-block" href={getClassAppPath(notification.classId!)}>
                Class
              </Link>
              !
            </p>
          </div>
        )

      default:
        break
    }
  }

  const getNotifications = async () => {
    try {
      const result = await getUserNotifications()

      if (!result.error) setNotificationList(result.notifications)
      else throw result.error
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotification = async (id: string, action: 'read' | 'delete') => {
    try {
      if (action === 'delete') await deleteNotification(id)
      else await readNotification(id)

      await getNotifications()
    } catch (error) {
      console.log(error)
    }
  }

  const colorsDropdownMenu = () => (
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
            <DropdownMenuRadioItem
              style={{ color: `${idx > 0 && 'hsl(var(--chart-' + idx + '))'}`, fontWeight: 'bold' }}
              value={el.value}
              key={idx}
            >
              {el.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const isNewNotification = notificationList.find((el) => el.status === NOTIFICATION_STATUSES.new)
  const notificationsStyle = isNewNotification ? 'notification' : ''

  const notificationsDropDownMenu = () => (
    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
      <DropdownMenuTrigger asChild>
        <span
          className="
            relative flex items-center gap-3 h-10 px-2 hover:bg-accent cursor-pointer rounded-md font-semibold w-full
          "
        >
          {isNewNotification && (
            <span
              className="
              w-4 h-4 absolute top-1 left-5 bg-warn rounded-full text-xs pt-[1px]
              flex items-center justify-center font-balsamiqSans text-white
            "
            >
              {notificationList.filter((el) => el.status === NOTIFICATION_STATUSES.new).length}
            </span>
          )}
          {!!notificationList.length ? <BellDot className="text-primary" /> : <Bell className="text-primary" />}
          <span className="text-primary">Notifications</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="right-0 w-fit" side="left" align="start">
        <DropdownMenuLabel>Notifications Center</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="min-h-20 max-h-72 md:max-h-fit px-2 flex flex-col overflow-y-auto">
          {!notificationList.length ? (
            <span className="max-w-[calc(100vw-250px)] w-fit my-1">
              No any notifications yet <span className="font-emoji">🙄</span>
            </span>
          ) : (
            <>
              {notificationList.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`
                      max-w-[calc(100vw-250px)] w-full my-1 flex flex-col
                      md:flex-row items-center justify-between rounded-md h-fit p-2
                      ${item.status === NOTIFICATION_STATUSES.new ? 'notification-new bg-primary/25' : 'bg-primary/10'}
                    `}
                  >
                    <div className="mt-3 md:ml-4 md:mt-0">{getNotificationMessage(item)}</div>
                    <div className="mt-5 md:ml-5 md:mt-0 flex gap-1">
                      {item.status === NOTIFICATION_STATUSES.new && (
                        <span className="bg-primary/10 icon-hover" onClick={() => handleNotification(item.id, 'read')}>
                          <Check size={15} />
                        </span>
                      )}
                      <span className="bg-primary/10 icon-hover" onClick={() => handleNotification(item.id, 'delete')}>
                        <Trash2 size={15} />
                      </span>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {session?.user ? (
        <NavigationMenu className="profile-menu" value={menuValue} onValueChange={setMenuValue}>
          <NavigationMenuList>
            <NavigationMenuItem value="menu" className="h-[43px] mt-1">
              <NavigationMenuTrigger className={`px-0 bg-background ${notificationsStyle ? notificationsStyle : ''}`}>
                {!session.user.image ? (
                  <Settings className="text-muted-foreground" />
                ) : (
                  <Image
                    className="h-[43px] w-[43px] rounded-full object-cover"
                    src={session.user.image}
                    width={30}
                    height={30}
                    alt="image"
                    priority
                  />
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className="p-1 pr-[6px] pb-[6px] flex flex-col"
                onPointerLeave={(e) => (isShow || showNotifications) && e.preventDefault()}
              >
                <NavigationMenuLink asChild>
                  <Link
                    className="px-2 h-10 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md font-semibold"
                    href={profileAppPath}
                  >
                    <UserRoundCog className="text-primary" />
                    <span className="text-primary">Settings</span>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>{notificationsDropDownMenu()}</NavigationMenuLink>
                <NavigationMenuLink onSelect={(e) => e.preventDefault()} asChild>
                  <span
                    onClick={() => setMenuValue('menu')}
                    className="h-10 px-2 hover:bg-accent flex items-center cursor-pointer rounded-md font-semibold"
                  >
                    <ThemeBtn text="Mode" />
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>{colorsDropdownMenu()}</NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    className="px-2 h-10 hover:bg-accent flex items-center gap-3 cursor-pointer rounded-md font-semibold"
                    href={contactUsAppPath}
                  >
                    <Mail className="text-primary" />
                    <span className="text-primary">Contact Us</span>
                  </Link>
                </NavigationMenuLink>
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
          <Link href={getLocaleUrl(signUpAppPath)}>
            <span className="icon-hover">
              <UserRoundPlus />
            </span>
          </Link>
          <Link href={getLocaleUrl(signInAppPath)}>
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
