'use client'

import { ReactElement, useRef, useState } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

import { TextEffect } from '../ui/text-effect'
import DialogWrap from '../dialog-wrap'
import { TextLoop } from '../ui/text-loop'
import { Button } from '../ui/button'

import classmatesImg from '@/../public/classmates.png'
import tutorImg from '@/../public/tutor.png'

import useDisplayData from '@/hooks/useDisplayData'

export default function HeroSection({ dialogContent, isClose }: { dialogContent: ReactElement; isClose: boolean }) {
  const [isScroll, setScroll] = useState(false)

  const { viewSize, isMobile, isXlDisplay, is2XlDisplay } = useDisplayData()
  const { theme } = useTheme()
  const t = useTranslations('Home.guestMode')

  const isDark = theme?.includes('-dark')

  const bgColors = [
    'hsl(198 43% 41% / 0.5)',
    'hsl(2 43% 41% / 0.5)',
    'hsl(277 43% 41% / 0.5)',
    'hsl(130 43% 41% / 0.5)',
    'hsl(198 43% 41% / 0.5)',
  ]

  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress, scrollY } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${Number(ref.current?.clientHeight) / (isMobile ? 3 : isXlDisplay ? 1.75 : 2)}px`],
  )
  const xLeft = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${Number(ref.current?.clientHeight) / (isXlDisplay ? -1.75 : -2)}px`],
  )
  const xRight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${Number(ref.current?.clientHeight) / (isXlDisplay ? 1.75 : 2)}px`],
  )

  useMotionValueEvent(scrollYProgress, 'change', (val: number) => {
    if (val > 0 && !isScroll) setScroll(true)
    else if (val === 0 && isScroll) setScroll(false)
  })

  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const opacityImg = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const brightness = useTransform(scrollY, [0, 500], [0.5, 0.9])
  const blur = useTransform(scrollY, [0, 500], [2, 15])
  const backdrop = useMotionTemplate`brightness(${brightness}) blur(${blur}px)`

  return (
    <div
      className={`
        min-h-[calc(100dvh)] mt-[-75px] flex flex-col xl:flex-row gap-10 justify-center items-center relative
      `}
      ref={ref}
    >
      <div
        className={`
          h-full bg-[url('/board.webp')] ${isDark ? 'brightness-50' : ''}
          ${isMobile ? 'bg-contain' : 'bg-cover'} bg-center bg-fixed absolute z-0
        `}
        style={{ width: `${viewSize}px` }}
      />
      <motion.div
        className="h-full absolute"
        style={{ width: `${viewSize}px`, backdropFilter: backdrop }}
        animate={{ backgroundColor: [...bgColors] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="xl:w-1/2 text-center z-20 relative">
        <motion.div
          className="relative z-20"
          style={{ y, scale }}
          initial={{ opacity: 0, x: is2XlDisplay ? -1000 : -500 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
        >
          <TextEffect className="sub-title-1 mb-5 text-background" preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3}>
            {t('welcome')}
          </TextEffect>
          <TextEffect
            className={`
              max-w-[500px] ${!isDark ? 'text-background/70' : 'text-accent-foreground/70'}
              mx-auto p-3 bg-white/10 backdrop-blur-sm shadow-lg
              rounded-2xl italic font-semibold border border-white/20
            `}
            per="char"
            preset="fade"
          >
            {t('message')}
          </TextEffect>
        </motion.div>
        <motion.div
          className="w-fit hidden xl:block relative mx-auto mt-20 z-0"
          style={{ opacity: opacityImg, x: isScroll ? xLeft : 0 }}
          initial={{ opacity: 0, x: is2XlDisplay ? -1000 : -500 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 150 }}
        >
          <Image src={tutorImg} alt="tutor" className={`${isDark ? 'brightness-50' : ''}`} width={300} height={300} priority />
        </motion.div>
      </div>
      <div className={`w-full xl:w-1/2 text-center ${!isXlDisplay ? 'overflow-hidden' : ''}`}>
        <motion.div
          className="relative z-10"
          style={{ opacity: isXlDisplay ? 1 : opacity, y: isXlDisplay ? y : 0, scale: isXlDisplay ? scale : 1 }}
          initial={{ x: is2XlDisplay ? 1000 : 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
        >
          <TextLoop className="w-full mb-8 xl:mb-14 text-center hidden md:block" interval={3} transition={{ duration: 0.5 }}>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                {t('improve')}
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                {t('increase')}
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl ">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                {t('expend')}
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                {t('enjoy')}
              </TextEffect>
            </span>
          </TextLoop>
          <div className="w-fit mx-auto relative hover:scale-105 duration-300">
            <DialogWrap
              width="max-w-[400px]"
              title={
                <p>
                  {t('welcomePopup')} <span className="emoji mr-1">👋</span>
                </p>
              }
              trigger={
                <Button
                  className={`
                    relative bg-white/10 hover:bg-white/20 ${isMobile ? 'text-xl' : 'text-2xl'}
                    ${isMobile ? 'p-6' : 'p-8'} backdrop-blur-md shadow-lg border border-white/20
                    ${!isDark ? '!text-background/70' : '!text-accent-foreground/70'} duration-300
                  `}
                  variant="ghost"
                >
                  {t('startJourney')} 😎
                </Button>
              }
              content={dialogContent}
              isAutoClose={isClose}
            />
          </div>
        </motion.div>
        <motion.div
          className="w-fit hidden xl:block relative mx-auto mt-[87px] z-0"
          style={{ opacity: opacityImg, x: isScroll ? xRight : 0 }}
          initial={{ opacity: 0, x: is2XlDisplay ? 1000 : 500 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 150 }}
        >
          <Image
            src={classmatesImg}
            alt="classmates"
            className={`${isDark ? 'brightness-50' : ''}`}
            width={300}
            height={300}
            priority
          />
        </motion.div>
      </div>
    </div>
  )
}
