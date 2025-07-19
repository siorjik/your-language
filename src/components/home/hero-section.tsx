'use client'

import { ReactElement, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import DialogWrap from '../dialog-wrap'
import { GlowEffect } from '../ui/glow-effect'
import { TextLoop } from '../ui/text-loop'
import { Button } from '../ui/button'

import classmatesImg from '@/../public/classmates.png'
import tutorImg from '@/../public/tutor.png'

import useDisplayData from '@/hooks/useDisplayData'

export default function HeroSection({ dialogContent, isClose }: { dialogContent: ReactElement; isClose: boolean }) {
  const { viewSize, isMobile, isXlDisplay } = useDisplayData()
  const { theme } = useTheme()

  const isDark = theme?.includes('-dark')

  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${Number(ref.current?.clientHeight) / (isMobile ? 2.5 : isXlDisplay ? 1.75 : 2)}px`],
  )
  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div
      className={`
        min-h-[calc(100vh-50px)] mt-[-20px] flex flex-col xl:flex-row gap-10 justify-center items-center relative
      `}
      ref={ref}
    >
      <div
        className="h-full bg-[url('/board.webp')] brightness-75 bg-cover bg-center bg-fixed absolute z-0"
        style={{ width: `${viewSize}px` }}
      />
      <div className="h-full backdrop-brightness-50 bg-primary/50 absolute" style={{ width: `${viewSize}px` }} />
      <div className="xl:w-1/2 text-muted-foreground text-center z-20 relative">
        <motion.div className="relative z-20" style={{ y, scale }}>
          <h3 className="sub-title-1 mb-5 text-background/70">Welcome to Your Language Companion!</h3>
          <p className="max-w-[500px] mx-auto p-3 bg-muted rounded-lg italic font-semibold">
            Discover a smarter, more engaging way to learn English. Whether you`re just starting out or sharpening advanced
            skills, our powerful tools help you build vocabulary, master grammar, and grow your confidence - step by step
            <span className="emoji">👌</span>
          </p>
        </motion.div>
        <motion.div className="w-fit hidden xl:block relative mx-auto mt-20 z-0" style={{ opacity }}>
          <Image
            src={tutorImg}
            alt="classmates"
            className={`${isDark ? 'brightness-50' : ''}`}
            width={300}
            height={300}
            priority
          />
        </motion.div>
      </div>
      <div className="w-full xl:w-1/2 text-center">
        <motion.div
          className="relative z-10"
          style={{ opacity: isXlDisplay ? 1 : opacity, y: isXlDisplay ? y : '', scale: isXlDisplay ? scale : 1 }}
        >
          <TextLoop className="w-full mb-10 xl:mb-14 text-center hidden md:block" interval={3} transition={{ duration: 0.5 }}>
            <span className="sub-title-1 text-background text-3xl">Improve your language skills!</span>
            <span className="sub-title-1 text-background text-3xl">Increase your conversation confidence!</span>
            <span className="sub-title-1 text-background text-3xl ">Expend your vocabulary!</span>
            <span className="sub-title-1 text-background text-3xl">Enjoy your learning process!</span>
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
        <motion.div className="w-fit hidden xl:block relative mx-auto mt-20 z-0" style={{ opacity }}>
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
