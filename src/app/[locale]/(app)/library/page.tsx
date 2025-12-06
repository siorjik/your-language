'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import Link from '@/components/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { GlowEffect } from '@/components/ui/glow-effect'

import { activitiesAppPath, classesAppPath, newSetAppPath, setsAppPath } from '@/utils/paths'

export default function Library() {
  const t = useTranslations('Library')

  return (
    <>
      <h2 className="mx-auto w-fit title">{t('title')}</h2>
      <div className="flex flex-col md:flex-row flex-wrap xl:flex-nowrap justify-center gap-6">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1 * 0.1 }}
        >
          <Link className="w-full" href={setsAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated text-lg">
              {t('sets.goTo')}
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🔥 {t('sets.title')}</CardTitle>
              <CardDescription className="text-center italic">{t('sets.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="italic font-semibold text-muted-foreground">
              <p>{t('sets.text')}</p>
              <p className="my-3 text-foreground">{t('sets.includes')}</p>
              <p className="text-primary">⭐️ {t('sets.flashcards')}</p>
              <p className="mt-1 mb-3">{t('sets.flashcardsText')}</p>
              <p className="text-primary">⭐️ {t('sets.memorization')} </p>
              <p className="mt-1 mb-3">{t('sets.memorizationText')}</p>
              <p className="text-primary">⭐️ {t('sets.spelling')}</p>
              <p>{t('sets.spellingText')}</p>
              <p className="mt-5 text-foreground">{t('sets.textEnd')}</p>
            </CardContent>
            <CardFooter>
              <div className="mx-auto relative">
                <GlowEffect className="rounded-md" mode="flowHorizontal" blur="soft" duration={5} scale={1} />
                <Button asChild className="relative m-[2px]">
                  <Link href={newSetAppPath}>{t('sets.create')}</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.5 * 0.1 }}
        >
          <Link className="w-full" href={activitiesAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated text-lg">
              {t('activities.goTo')}
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🧠 {t('activities.title')}</CardTitle>
              <CardDescription className="text-center italic">{t('activities.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="italic font-semibold text-muted-foreground">
              <p>{t('activities.text')}</p>
              <p className="my-3 text-foreground">☝️ {t('activities.how')}</p>
              <p>
                <span className="not-italic">1️⃣</span> {t('activities.choose')}
              </p>
              <p className="my-3">
                <span className="not-italic">2️⃣</span> {t('activities.pick')}
              </p>
              <p>
                <span className="not-italic">3️⃣</span> {t('activities.track')}
              </p>
              <p className="my-5">
                <span className="not-italic">📊</span>
                {t('activities.passed')}
              </p>
              <p className="mt-5 text-foreground">{t('activities.textEnd')}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 400 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 2 * 0.1 }}
        >
          <Link className="w-full" href={classesAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated text-lg">
              {t('classes.goTo')}
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🚀 {t('classes.title')}</CardTitle>
              <CardDescription className="text-center italic">{t('classes.subtitle')}</CardDescription>
            </CardHeader>
            <div className="h-full flex flex-col justify-between">
              <CardContent className="italic font-semibold text-muted-foreground">
                <p>{t('classes.text')}</p>
                <p className="my-3 text-foreground">
                  <span className="not-italic">🔑</span> {t('classes.features')}
                </p>
                <p className="text-primary mb-1">
                  <span className="not-italic font-emoji">🎓</span> {t('classes.create')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✅</span> {t('classes.start')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✅</span> {t('classes.choose')}
                </p>
                <p>
                  <span className="not-italic font-emoji">✅</span> {t('classes.perfect')}{' '}
                  <span className="not-italic font-emoji">👨‍🏫</span>, {t('classes.group')}
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">🤝</span> {t('classes.join')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">📌</span> {t('classes.share')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">📌</span> {t('classes.joinExisting')}
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">📚</span> {t('classes.shared')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">📎</span> {t('classes.createActivities')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">📎</span> {t('classes.everyone')}
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">🎮</span> {t('classes.train')}
                </p>
                <p className="my-2 font-semibold text-foreground">{t('classes.practice')}</p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">🃏</span> {t('classes.flashcards')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">❓</span> {t('classes.quizzes')}
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✍️</span> {t('classes.spelling')}
                </p>
              </CardContent>
              <CardFooter>
                <div className="mx-auto relative">
                  <GlowEffect className="rounded-md" mode="flowHorizontal" blur="soft" duration={5} scale={1} />
                  <Button asChild className="relative m-[2px]">
                    <Link href={classesAppPath}>{t('classes.createNew')}</Link>
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
