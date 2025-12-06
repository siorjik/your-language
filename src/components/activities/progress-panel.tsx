'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { SetList } from '@/types/models/set'

export default function ProgressPanel({ result }: { result: { failed: SetList; passed: SetList } }) {
  const t = useTranslations('activities')

  return (
    <div className="max-w-4xl mt-5 mx-auto flex justify-evenly">
      <div className="text-success text-xl font-semibold">
        {t('passed')}{' '}
        <motion.span
          className="inline-block"
          key={result.passed.length}
          initial={{ scale: 10 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {result.passed.length}
        </motion.span>
      </div>
      <div className="text-destructive text-xl font-semibold">
        {t('failed')}{' '}
        <motion.span
          className="inline-block"
          key={result.failed.length}
          initial={{ scale: 10 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {result.failed.length}
        </motion.span>
      </div>
    </div>
  )
}
