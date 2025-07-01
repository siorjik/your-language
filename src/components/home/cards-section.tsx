'use client'

import { RefObject, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'

import getTransformedDate from '@/helpers/getTransformedDate'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { getSetAppPath, newSetAppPath } from '@/utils/paths'
import { Set } from '@prisma/client'

export default function CardSection({ sets }: { sets: Set[] }) {
  const [isShowNav, setShowNav] = useState(false)

  const divRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // to trigger scroll arrows
    window.addEventListener('resize', toggleShowArr)

    return () => {
      window.removeEventListener('resize', toggleShowArr)
    }
  }, [isShowNav])

  const toggleShowArr = () => setShowNav(!isShowNav)

  const getSetCard = (set: Set, date: string) => {
    return (
      <motion.div
        key={set.id}
        initial={{ rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 1, type: 'spring', stiffness: 500, delay: 0.3 }}
      >
        <Link href={getSetAppPath(set.id)}>
          <Card
            className="
              text-center border-0 bg-secondary/10 shadow-lg cursor-pointer
              hover:bg-secondary/30 hover:translate-y-[-10px] hover:scale-[1.03] hover:shadow-xl duration-300
            "
          >
            <CardHeader>
              <CardTitle className="w-[250px] truncate">{set.title}</CardTitle>
              <CardDescription>
                {LANGUAGE_OPTIONS.find((lg) => lg.value === set.source)?.label + ' / '}
                {LANGUAGE_OPTIONS.find((lg) => lg.value === set.target)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{date}</p>
            </CardContent>
            <CardFooter>
              <span className="mx-auto link">Go To Set {'>>>'}</span>
            </CardFooter>
          </Card>
        </Link>
      </motion.div>
    )
  }

  const getSuggestSetCard = () => (
    <motion.div
      key={3}
      initial={{ rotateX: 90 }}
      animate={{ rotateX: 0 }}
      transition={{ duration: 1, type: 'spring', stiffness: 500, delay: 0.3 }}
    >
      <Link className="link text-xl" href={newSetAppPath}>
        <Card
          className="
            w-[300px] h-[190px] flex justify-center items-center border-0 bg-secondary/10 shadow-lg
            cursor-pointer hover:bg-secondary/30 hover:translate-y-[-10px] hover:scale-[1.03] hover:shadow-xl duration-300
          "
        >
          <CardContent className="p-0">
            <span className="link text-xl">Create one more!{' >>>'}</span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )

  const moveSlides = (direction: 'back' | 'ahead', ref: HTMLDivElement) => {
    if (direction === 'ahead') ref.scrollLeft += ref.clientWidth
    else ref.scrollLeft -= ref.clientWidth
  }

  const getCardsSection = (ref: RefObject<HTMLDivElement>) => {
    let isShow = false

    const arr = sets
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      .slice(-4)
      .reverse()

    switch (arr.length + 1) {
      case 2:
        if (window.innerWidth < 768) isShow = true
        break
      case 3:
        if (window.innerWidth <= 768) isShow = true
        break
      case 4:
      case 5:
        if (window.innerWidth < 1440) isShow = true
        break

      default:
        isShow = false
    }

    return (
      <>
        <p className="sub-title-3 mb-0">Recent created sets:</p>
        <div className="relative overflow-hidden">
          <div className="w-full px-3 py-5 flex gap-5 overflow-x-auto scroll-smooth" ref={ref}>
            <span
              className={`icon-hover absolute z-10 left-2 top-24 ${!isShow ? 'hidden' : ''}`}
              onClick={() => moveSlides('back', ref.current)}
            >
              <ChevronLeft size={30} />
            </span>
            {[
              ...arr.map((set) => {
                const date = getTransformedDate(new Date(set.createdAt))

                return getSetCard(set, date)
              }),
              getSuggestSetCard(),
            ].slice(0, 4)}
            <span
              className={`icon-hover absolute z-10 right-2 top-24 ${!isShow ? 'hidden' : ''}`}
              onClick={() => moveSlides('ahead', ref.current)}
            >
              <ChevronRight size={30} />
            </span>
          </div>
        </div>
      </>
    )
  }

  return <>{getCardsSection(divRef as RefObject<HTMLDivElement>)}</>
}
