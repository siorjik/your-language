'use client'

import { ReactElement, useRef } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import { TextEffect } from '../ui/text-effect'
import DialogWrap from '../dialog-wrap'
import { GlowEffect } from '../ui/glow-effect'
import { TextLoop } from '../ui/text-loop'
import { Button } from '../ui/button'

import classmatesImg from '@/../public/classmates.png'
import tutorImg from '@/../public/tutor.png'

import useDisplayData from '@/hooks/useDisplayData'

export default function HeroSection({ dialogContent, isClose }: { dialogContent: ReactElement; isClose: boolean }) {
  const { viewSize, isMobile, isXlDisplay, is2XlDisplay } = useDisplayData()
  const { theme } = useTheme()

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

  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

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
      <div className="xl:w-1/2 text-muted-foreground text-center z-20 relative">
        <motion.div
          className="relative z-20"
          style={{ y, scale }}
          initial={{ opacity: 0, x: is2XlDisplay ? -1000 : -500 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
        >
          <TextEffect className="sub-title-1 mb-5 text-background" preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3}>
            Welcome to Language Bro!
          </TextEffect>
          <TextEffect
            className="max-w-[500px] mx-auto p-3 bg-transparent backdrop-blur-sm rounded-lg italic font-semibold border-2"
            per="char"
            preset="fade"
          >
            Discover a smarter, more engaging way to learn language. Whether you`re just starting out or sharpening advanced
            skills, our powerful tools help you build vocabulary, master grammar, and grow your confidence - step by step...
          </TextEffect>
        </motion.div>
        <motion.div
          className="w-fit hidden xl:block relative mx-auto mt-20 z-0"
          style={{ opacity }}
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
          <TextLoop className="w-full mb-10 xl:mb-14 text-center hidden md:block" interval={3} transition={{ duration: 0.5 }}>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                Improve your language skills!
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                Increase your conversation confidence!
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl ">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                Expend your vocabulary!
              </TextEffect>
            </span>
            <span className="sub-title-1 text-background text-3xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3} as="span">
                Enjoy your learning process!
              </TextEffect>
            </span>
          </TextLoop>
          <div className="w-fit mx-auto relative">
            <GlowEffect className="rounded-lg" mode="colorShift" blur="softest" duration={5} scale={1} />
            <DialogWrap
              width="max-w-[400px]"
              title={
                <p>
                  Welcome! <span className="emoji mr-1">👋</span>
                </p>
              }
              trigger={
                <Button className="relative hover:bg-initial p-8 text-xl" variant="ghost">
                  Start Your Journey 😎
                </Button>
              }
              content={dialogContent}
              isAutoClose={isClose}
            />
          </div>
        </motion.div>
        <motion.div
          className="w-fit hidden xl:block relative mx-auto mt-20 z-0"
          style={{ opacity }}
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
