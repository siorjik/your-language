'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import Link from '@/components/link'
import SetList from '@/components/set-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SelectedClass } from '@/types/models/class'
import { getClassAppPath, getUserAppPath } from '@/utils/paths'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function UserTabs({
  userId,
  classes,
  setsAmount,
}: {
  userId: string
  classes: SelectedClass[]
  setsAmount: number
}) {
  const { push } = useRouter()
  const { getLocaleUrl } = useLocaleUrl()

  return (
    <>
      <Tabs defaultValue="sets" className="w-full">
        <TabsList className="w-full mb-5 flex justify-between overflow-x-auto sticky top-0 z-10">
          <TabsTrigger className="w-full" value="sets">
            Sets - {setsAmount}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="classes">
            Classes - {classes.length}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sets">
          <div className="mt-[-30px]">
            <SetList userId={userId} queryKey={['sets', userId]} isSimple />
          </div>
        </TabsContent>
        <TabsContent value="classes">
          {!!classes.length ? (
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-x-5 justify-center">
              {classes.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                  key={idx}
                >
                  <Link href={getClassAppPath(item.id)}>
                    <div
                      className="
                      w-full lg:w-[350px] p-5 mb-5 flex gap-5 items-center bg-primary/10 hover:bg-primary/20
                      rounded-lg hover:scale-[1.03] shadow-lg duration-500
                    "
                    >
                      {item.image ? (
                        <Image
                          className="object-cover min-w-[100px] max-w-[100px] h-[100px] border-2 rounded-lg"
                          width={100}
                          height={100}
                          src={item.image}
                          alt={item.image}
                        />
                      ) : (
                        <ImageIcon className="min-w-[100px] max-w-[100px] h-[100px] border-2 rounded-lg" size={100} />
                      )}
                      <div className="overflow-hidden">
                        <h3 className="sub-title-1 truncate">{item.title}</h3>
                        <p className="mb-3 text-muted-foreground font-semibold text-sm">
                          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </p>
                        <div className="flex gap-1 truncate">
                          <span className="text-sm text-muted-foreground/50 font-semibold">Created by:</span>
                          <div
                            className="flex gap-1 overflow-hidden"
                            onClick={(e) => {
                              e.preventDefault()

                              push(getLocaleUrl(getUserAppPath(item.creatorId)))
                            }}
                          >
                            {item.creator.image && (
                              <Image
                                className="h-5 w-5 object-cover rounded-full"
                                src={item.creator.image}
                                alt="image"
                                width={20}
                                height={20}
                              />
                            )}
                            <span className="link truncate">{item.creator.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="w-fit mx-auto font-semibold text-lg">There are no any classes 🤨...</p>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
