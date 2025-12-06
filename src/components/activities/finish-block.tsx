'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { SetList } from '@/types/models/set'

import partyPopperImg from '@/../public/party-popper.png'

export default function FinishBlock({
  result,
  start,
  repeat,
  isFlashcards,
}: {
  result?: { failed: SetList; passed: SetList }
  start: () => void
  repeat?: () => void
  isFlashcards?: boolean
}) {
  const t = useTranslations('finishBlock')

  return (
    <div className="w-fit mt-5 mx-auto text-xl font-semibold">
      {!isFlashcards ? (
        <>
          {t('niceJob')} <span className="font-emoji">👍</span>! {t('doYouWant') + ' '}
          {!!result?.failed.length && (
            <>
              <span className="link" onClick={repeat}>
                {t('repeat')}
              </span>{' '}
              {t('or') + ' '}
            </>
          )}
          <>
            <span className="link" onClick={start}>
              {t('startOver')}
            </span>
            ?
          </>
          {!result?.failed.length && (
            <motion.div
              className="w-fit my-20 mx-auto"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring', stiffness: 700 }}
            >
              <Image src={partyPopperImg} alt="party" width={200} height={200} />
            </motion.div>
          )}
        </>
      ) : (
        <>
          {t('niceJob')} <span className="font-emoji">👍</span>
          {'! '}
          <span className="link" onClick={start}>
            {t('refreshFlashcards')}
          </span>
          <motion.div
            className="w-fit my-20 mx-auto"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring', stiffness: 700 }}
          >
            <Image src={partyPopperImg} alt="party" width={200} height={200} />
          </motion.div>
        </>
      )}
    </div>
  )
}
