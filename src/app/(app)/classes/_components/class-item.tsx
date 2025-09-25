'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

import { SelectedClass } from '@/types/models/class'

export default function ClassItem({ data }: { data: SelectedClass }) {
  return (
    <>
      <Card className="h-full flex shadow-xl hover:bg-primary/30 hover:scale-[1.03] duration-500">
        <div className="flex items-center">
          {data.image ? (
            <Image
              className="object-contain py-2 h-[130px] min-w-[150px] max-w-[150px]"
              width={150}
              height={150}
              src={data.image}
              alt={data.image}
              priority
            />
          ) : (
            <ImageIcon className="pl-2 h-[130px] w-[150px]" size={130} />
          )}
        </div>
        <div className="w-full overflow-hidden justify-center">
          <CardHeader className="pt-3">
            <CardTitle className="flex justify-center text-primary">
              <p className="truncate leading-normal">{data.title}</p>
            </CardTitle>
            <CardDescription className="mx-auto text-xs">{format(data.createdAt, 'MM/yyyy')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 md:flex-row lg:flex-wrap justify-center">
            <p className="max-w-36 md:max-w-52 truncate">
              <span className="font-semibold">Creator:</span> {data.creator.name}
            </p>
            <p className="whitespace-nowrap">
              <span className="font-semibold">Sets:</span> {data.sets.length}
            </p>
            <p className="whitespace-nowrap">
              <span className="font-semibold">Members:</span> {data.users.length}
            </p>
          </CardContent>
        </div>
      </Card>
    </>
  )
}
