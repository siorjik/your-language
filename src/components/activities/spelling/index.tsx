'use client'

import { useState, useEffect, useRef, use } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Shuffle } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import FinishBlock from '../finish-block'
import { Separator } from '@/components/ui/separator'
import SetCreator from '@/components/set-creator'

import { ActivityType } from '@prisma/client'
import { SelectedSet, SetList, SetListItem } from '@/types/models/set'
import getShuffledArr from '@/helpers/getShuffledArr'
import useKeyPress from '@/hooks/useKeyPress'
import { ActivityTypesContext } from '@/contexts/activity-types-context'
import { createActivity } from '@/actions/activity'
import ProgressPanel from '../progress-panel'
import { ACTIVITIES_NAMES } from '@/utils/constants'

export default function Memorization({ data }: { data: SelectedSet }) {
  const [setList, setSetList] = useState<SetList>(data.list)
  const [index, setIndex] = useState(0)
  const [selectedMode] = useState<'definition'>('definition')
  const [selectedAnswerStyle, setSelectedAnswerStyle] = useState<{
    style: string
    letters?: { value: string; isCorrect: boolean }[]
  } | null>(null)
  const [result, setResult] = useState<{ failed: SetList; passed: SetList }>({ failed: [], passed: [] })
  const [isFinish, setFinish] = useState(false)
  const [value, setValue] = useState('')
  const [isShuffled, setShuffled] = useState(false)

  const pressEnter = useKeyPress('Enter')

  const response = use(ActivityTypesContext) as { activityTypes: ActivityType[] } | null

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value) setValue('')
    if (selectedAnswerStyle) setSelectedAnswerStyle(null)

    const timer = setTimeout(() => inputRef.current?.focus(), 100)

    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    // set activity for chart
    if (isFinish && !result.failed.length) {
      ;(async () => {
        const activityTypeId = response?.activityTypes.find((item) => item.name === ACTIVITIES_NAMES.spelling)?.id

        await createActivity(activityTypeId!, data.id)
      })()
    }
  }, [isFinish])

  useEffect(() => {
    if (pressEnter && index === result.failed.length + result.passed.length) onSetResult()
  }, [pressEnter, index, result])

  const onSetResult = (): void => {
    if (!value) return

    const isLast = index + 1 === setList.length
    const arr: { value: string; isCorrect: boolean }[] = []

    if (setList[index].term === value.trim()) {
      setSelectedAnswerStyle({ style: 'text-success font-semibold text-2xl' })
      setResult({ ...result, passed: [...result.passed, setList[index]] })

      setTimeout(() => {
        if (!isLast) setIndex((prev) => prev + 1)
        else setFinish(true)
      }, 1000)
    } else {
      const valueCharArr = value.split('')
      const setListItemCharArr = setList[index].term.split('')

      let firstMatchedLetter = ''

      allBreak: for (let i = 0; i < valueCharArr.length; i++) {
        for (const [idx, char] of Object.entries(setListItemCharArr)) {
          if (char === valueCharArr[i] && setListItemCharArr.indexOf(char) > 0 && valueCharArr.includes(setListItemCharArr[0])) {
            continue
          } else if (
            char === valueCharArr[i] &&
            setListItemCharArr.indexOf(char) > 0 &&
            !valueCharArr.includes(setListItemCharArr[0])
          ) {
            if (setListItemCharArr.includes(valueCharArr[i + 1])) {
              if (setListItemCharArr[+idx + 1] === valueCharArr[i + 1]) firstMatchedLetter = char
              else firstMatchedLetter = valueCharArr[i + 1]

              break allBreak
            } else continue
          } else if (char === valueCharArr[i]) {
            firstMatchedLetter = valueCharArr[i]

            break allBreak
          }
        }
      }

      const startIndexValue = valueCharArr.indexOf(firstMatchedLetter)
      const startIndexSet = setListItemCharArr.indexOf(firstMatchedLetter)
      const endIndexValue = setListItemCharArr.length - startIndexSet + startIndexValue

      const spareStartArr = valueCharArr.slice(0, startIndexValue)
      const valueArr = valueCharArr.slice(startIndexValue, endIndexValue)
      const spareEndArr = valueCharArr.slice(endIndexValue)

      if (!!spareStartArr.length) spareStartArr.forEach((value) => arr.push({ value, isCorrect: false }))

      if (!!valueArr.length) {
        valueArr.forEach((value, idx) => {
          arr.push({ value, isCorrect: value === setListItemCharArr[idx + startIndexSet] })
        })
      }

      if (!!spareEndArr.length) spareEndArr.forEach((value) => arr.push({ value, isCorrect: false }))

      setSelectedAnswerStyle({ style: 'text-destructive font-semibold text-2xl', letters: [...arr] })
      setResult({ ...result, failed: [...result.failed, setList[index]] })

      setTimeout(() => {
        if (!isLast) setIndex((prev) => prev + 1)
        else setFinish(true)
      }, 4000)
    }
  }

  const onStartOver = (action: 'start' | 'repeat') => {
    setSetList(
      action === 'repeat' ? result.failed : action === 'start' && isShuffled ? getShuffledArr<SetListItem>(data.list) : data.list,
    )
    setIndex(0)
    setResult({ passed: [], failed: [] })
    setFinish(false)
    setSelectedAnswerStyle(null)
    setValue('')

    setTimeout(() => inputRef.current?.focus(), 100)
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
    setSelectedAnswerStyle(null)
    setValue('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

  const onProvideAnswer = () => {
    if (
      result.failed.find((item) => item.definition === setList[index].definition) ||
      result.passed.find((item) => item.definition === setList[index].definition)
    )
      return

    const isLast = index + 1 === setList.length

    setResult({ ...result, failed: [...result.failed, setList[index]] })

    setTimeout(() => {
      if (!isLast) setIndex((prev) => prev + 1)
      else setFinish(true)
    }, 3000)
  }

  return (
    <>
      {!isFinish && (
        <>
          <h2 className="title w-full mb-5 !truncate font-semibold text-center">{data.title}</h2>
          <div className="max-w-4xl mx-auto">
            <p className="mb-5 text-lg font-semibold">{setList[index][selectedMode]}:</p>
            <div>
              {!selectedAnswerStyle && !result.failed.find((el) => el.definition === setList[index].definition) && (
                <input
                  className="w-full h-8 border-b-2 border-b-secondary text-xl text-center bg-transparent tracking-widest"
                  type="text"
                  onChange={onChange}
                  value={value}
                  placeholder="Your answer here..."
                  ref={inputRef}
                />
              )}
              {(selectedAnswerStyle || result.failed.find((el) => el.definition === setList[index].definition)) && (
                <div
                  className={`
                h-8 border-b-2 border-b-secondary text-xl flex gap-5 justify-center items-center
                ${selectedAnswerStyle && !selectedAnswerStyle.letters ? selectedAnswerStyle.style : ''}
              `}
                >
                  <p>
                    {value.split('').map((el, idx) => {
                      return (
                        <motion.span
                          className={`
                        tracking-widest inline-block
                        ${!selectedAnswerStyle?.letters?.[idx].isCorrect ? selectedAnswerStyle?.style : ''}
                      `}
                          key={idx + result.failed.length}
                          initial={{ scaleX: 2 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 2, type: 'spring', stiffness: 300 }}
                        >
                          {el !== ' ' ? el : <span>&nbsp;</span>}
                        </motion.span>
                      )
                    })}
                  </p>
                  {result.failed.find((el) => el.definition === setList[index].definition) && (
                    <motion.span
                      className="text-success font-semibold tracking-widest text-2xl"
                      key={result.failed.length}
                      initial={{ scaleX: 2, x: 200, opacity: 0.5 }}
                      animate={{ scaleX: 1, x: 0, opacity: 1 }}
                      transition={{ duration: 2, type: 'spring', stiffness: 100 }}
                    >
                      {setList[index].term}
                    </motion.span>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isFinish && (
        <>
          <div className="my-5 mx-auto flex items-center justify-center gap-10">
            <Button size="sm" variant="outline" onClick={onSetResult}>
              Check
            </Button>
            <span
              className={`icon-hover border-2 rounded-full border-transparent ${isShuffled ? '!border-primary' : ''}`}
              onClick={() => shuffle(!isShuffled)}
            >
              <Shuffle size={18} />
            </span>
            <span
              className="
                w-10 h-10 hidden md:flex items-center justify-center border-2
                border-bg-secondary rounded-full font-semibold text-primary
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
            <Button size="sm" variant="outline" onClick={onProvideAnswer}>
              Answer
            </Button>
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
