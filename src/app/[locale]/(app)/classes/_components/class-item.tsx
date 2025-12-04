'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

import { SelectedClass } from '@/types/models/class'
import { getUserAppPath } from '@/utils/paths'
import { BLURRED_DATA_URL } from '@/utils/constants'
import useLocaleUrl from '@/hooks/use-locale-url'

export default function ClassItem({ data, idx }: { data: SelectedClass; idx: number }) {
  const { push } = useRouter()
  const { getLocaleUrl } = useLocaleUrl()

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, x: idx % 2 === 0 ? -100 : 100 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: 'backOut' }}
    >
      <Card className="h-full flex shadow-xl hover:bg-primary/30 hover:scale-[1.03] duration-500">
        <div className="pl-3 flex items-center">
          {data.image ? (
            <Image
              className="object-cover h-[110px] min-w-[130px] max-w-[130px] rounded-lg"
              width={100}
              height={100}
              src={data.image}
              alt={data.image}
              priority
              placeholder="blur"
              blurDataURL={BLURRED_DATA_URL}
            />
          ) : (
            <ImageIcon className="ml-[-20px] h-[130px] w-[150px]" size={130} />
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
            <div className="max-w-36 md:max-w-52 flex gap-1">
              <span className="font-semibold text-muted-foreground/50">Creator:</span>
              <p
                className="flex gap-1 overflow-hidden"
                onClick={(e) => {
                  e.preventDefault()

                  push(getLocaleUrl(getUserAppPath(data.creator.id)))
                }}
              >
                {data.creator.image && (
                  <Image
                    className="h-5 min-w-5 max-w-5 object-cover rounded-full"
                    src={data.creator.image}
                    alt="image"
                    width={20}
                    height={20}
                  />
                )}
                <span className="link truncate">{data.creator.name}</span>
              </p>
            </div>
            <p className="whitespace-nowrap">
              <span className="font-semibold text-muted-foreground/50">Sets:</span> {data.sets.length}
            </p>
            <p className="whitespace-nowrap">
              <span className="font-semibold text-muted-foreground/50">Members:</span> {data.users.length}
            </p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
