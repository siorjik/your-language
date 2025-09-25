'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ImageIcon } from 'lucide-react'
import Link from 'next/link'

import SetList from '@/components/set-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SelectedClass } from '@/types/models/class'
import { getClassAppPath } from '@/utils/paths'

export default function UserTabs({ userId, classes }: { userId: string; classes: SelectedClass[] }) {
  return (
    <>
      <Tabs defaultValue="sets" className="w-full">
        <TabsList className="w-full mb-5 flex justify-between overflow-x-auto sticky top-0 z-10">
          <TabsTrigger className="w-full" value="sets">
            Sets
          </TabsTrigger>
          <TabsTrigger className="w-full" value="classes">
            Classes
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
                <Link key={idx} href={getClassAppPath(item.id)}>
                  <div
                    className="
                    w-full lg:w-[350px] p-5 mb-5 flex gap-5 items-center bg-primary/10 hover:bg-primary/20
                    rounded-lg hover:scale-[1.03] shadow-lg duration-500
                  "
                  >
                    {item.image ? (
                      <Image
                        className="w-[100px] h-[100px] border-2 rounded-lg"
                        width={100}
                        height={100}
                        src={item.image}
                        alt={item.image}
                      />
                    ) : (
                      <ImageIcon className="border-2 rounded-lg" size={100} />
                    )}
                    <div className="overflow-hidden">
                      <h3 className="sub-title-1 truncate">{item.title}</h3>
                      <p className="mb-3 text-primary font-semibold text-sm">
                        {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                      </p>
                      <p className="text-sm font-semibold truncate">Created by: {item.creator.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-fit mx-auto font-semibold">There are no any classes 🤨...</div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
