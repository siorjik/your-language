'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Shuffle } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import SelectWrap from '@/components/select-wrap'
import ProgressPanel from '../progress-panel'
import FinishBlock from '../finish-block'
import SetCreator from '@/components/set-creator'
import { Separator } from '@/components/ui/separator'

import { ActivityType } from '@prisma/client'
import { SelectedSet, SetList, SetListItem } from '@/types/models/set'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import getShuffledArr from '@/helpers/getShuffledArr'
import { ActivityTypesContext } from '@/contexts/activity-types-context'
import { createActivity } from '@/actions/activity'

export default function Memorization({ data }: { data: SelectedSet }) {
  const [setList, setSetList] = useState<SetList>(data.list)
  const [shuffledList, setShuffledList] = useState<SetList>([])
  const [index, setIndex] = useState(0)
  const [selectedMode, setSelectedMode] = useState<'term' | 'definition'>('term')
  const [selectedAnswerStyle, setSelectedAnswerStyle] = useState<{ style: string; idx: number } | null>(null)
  const [result, setResult] = useState<{ failed: SetList; passed: SetList }>({ failed: [], passed: [] })
  const [isFinish, setFinish] = useState(false)
  const [isShuffled, setShuffled] = useState(false)

  const response = use(ActivityTypesContext) as { activityTypes: ActivityType[] } | null

  useEffect(() => {
    // set activity for chart
    if (index + 1 === setList.length && !result.failed.length) {
      ;(async () => {
        const activityTypeId = response?.activityTypes.find((item) => item.name === 'memorization')?.id

        await createActivity(activityTypeId!, data.id)
      })()
    }

    const shuffledArr = getShuffledArr([
      ...data.list?.filter((item) => item[selectedMode] !== setList[index][selectedMode]),
    ]).splice(0, 3)

    shuffledArr.push(setList[index])

    setShuffledList(getShuffledArr(shuffledArr))
  }, [index, setList])

  const onSetResult = (item: SetListItem, idx: number): void => {
    // prevent double click the same item
    if (result.passed.length + result.failed.length > index) return

    const isLast = index + 1 === setList.length

    if (item[selectedMode] === setList[index][selectedMode]) {
      setSelectedAnswerStyle({ style: '!bg-success text-success-foreground', idx })
      setResult({ ...result, passed: [...result.passed, setList[index]] })

      setTimeout(() => {
        setSelectedAnswerStyle(null)

        if (!isLast) setIndex((prev) => prev + 1)
        else setFinish(true)
      }, 1000)
    } else {
      setSelectedAnswerStyle({ style: '!bg-destructive text-destructive-foreground', idx })
      setResult({ ...result, failed: [...result.failed, setList[index]] })

      // show correct answer if failed
      shuffledList.forEach((el, idx) => {
        if (el[selectedMode] === setList[index][selectedMode]) {
          setTimeout(() => setSelectedAnswerStyle({ style: '!bg-success/30 border-2 border-success', idx }), 1000)
        }
      })

      setTimeout(() => {
        setSelectedAnswerStyle(null)

        if (!isLast) setIndex((prev) => prev + 1)
        else setFinish(true)
      }, 3000)
    }
  }

  const onStartOver = (action: 'start' | 'repeat') => {
    setSetList(
      action === 'repeat' ? result.failed : action === 'start' && isShuffled ? getShuffledArr<SetListItem>(data.list) : data.list,
    )
    setIndex(0)
    setResult({ passed: [], failed: [] })
    setFinish(false)
  }

  const shuffle = (isShuffled: boolean) => {
    setShuffled(isShuffled)
    setSetList(
      isShuffled
        ? getShuffledArr<SetListItem>(setList)
        : data.list?.filter((item) => setList.find((el) => el.term === item.term)),
    )
    setIndex(0)
    setResult({ passed: [], failed: [] })
  }

  return (
    <>
      {!isFinish && (
        <div className="w-full mb-5 flex flex-col md:flex-row justify-evenly items-center">
          <h2 className="title w-full md:w-fit !truncate md:mb-0 font-semibold text-center">{data.title}</h2>
          <div className="w-fit">
            <SelectWrap
              options={[
                { label: `Term (${LANGUAGE_OPTIONS.find((item) => data.source === item.value)?.label})`, value: 'term' },
                {
                  label: `Definition (${LANGUAGE_OPTIONS.find((item) => data.target === item.value)?.label})`,
                  value: 'definition',
                },
              ]}
              onValueChange={(val) => setSelectedMode(val as 'term' | 'definition')}
              defaultValue={selectedMode}
              placeholder="Choose mode"
              label="Choose mode"
            />
          </div>
        </div>
      )}

      {!isFinish && (
        <div className="max-w-4xl mx-auto">
          <p className="mb-5 text-lg font-semibold">{setList[index][selectedMode]}:</p>
          <motion.ul
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 200 }}
          >
            {shuffledList?.map((item, idx) => (
              <motion.li
                key={idx}
                className={`
                  h-14 pb-2 pt-1 px-3 flex items-center bg-secondary/30 cursor-pointer rounded-lg shadow-md duration-300
                  ${selectedAnswerStyle?.idx === idx ? selectedAnswerStyle.style : ''}
                `}
                whileHover={{ boxShadow: '5px 5px 5px hsl(var(--secondary))' }}
                onClick={() => onSetResult(item, idx)}
              >
                <span className="max-h-12 line-clamp-2 leading-normal">
                  {item[selectedMode === 'term' ? 'definition' : 'term']}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {!isFinish && (
        <>
          <div className="my-5 mx-auto flex items-center justify-center gap-10">
            <span
              className={`icon-hover border-2 rounded-full border-transparent ${isShuffled ? '!border-primary' : ''}`}
              onClick={() => shuffle(!isShuffled)}
            >
              <Shuffle size={18} />
            </span>
            <span
              className="
                w-10 h-10 flex items-center justify-center border-2 border-bg-secondary text-primary rounded-full font-semibold
              "
            >
              {index + 1}
            </span>
            <span
              className="icon-hover"
              onClick={() => {
                if (index === 0) return

                setIndex(0)
                setResult({ passed: [], failed: [] })
              }}
            >
              <RotateCcw size={20} />
            </span>
          </div>
          <div className="max-w-4xl mx-auto flex items-center gap-1">
            <span className="text-xl font-semibold text-primary">1</span>
            <Progress className="" value={(100 / setList.length) * (result.passed.length + result.failed.length)} />
            <span className="text-xl font-semibold text-primary">{setList.length}</span>
          </div>
        </>
      )}
      <ProgressPanel result={result} />
      {!isFinish && (
        <div>
          <Separator className="my-5" />
          <SetCreator setId={data.id} />
        </div>
      )}
      {isFinish && <FinishBlock result={result} repeat={() => onStartOver('repeat')} start={() => onStartOver('start')} />}
    </>
  )
}
