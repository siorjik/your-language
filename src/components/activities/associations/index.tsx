'use client'

import { useEffect, useState, use } from 'react'
import { RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'

import SelectWrap from '@/components/select-wrap'
import { Button } from '@/components/ui/button'
import ProgressPanel from '../progress-panel'
import FinishBlock from '../finish-block'
import SetCreator from '@/components/set-creator'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

import { SelectedSet, SetList, SetListItem } from '@/types/models/set'
import getShuffledArr from '@/helpers/getShuffledArr'
import { createActivity } from '@/actions/activity'
import { ActivityTypesContext } from '@/contexts/activity-types-context'
import { ActivityType } from '@prisma/client'
import { ACTIVITIES_NAMES } from '@/utils/constants'
import { associationsApiPath } from '@/utils/paths'

const randomIndex = (max: number, min: number = 0) => Math.floor(Math.random() * (max - min + 1)) + min
const delay = process.env.NEXT_PUBLIC_APP_ENV === 'development' ? 200 : 800

export default function Associations({ data }: { data: SelectedSet }) {
  const [list, setList] = useState<SelectedSet['list']>(data.list)
  const [shuffledList, setShuffledList] = useState<SetList>([])
  const [current, setCurrent] = useState<(SetListItem & { association?: string }) | null>(null)
  const [selectedAnswerStyle, setSelectedAnswerStyle] = useState<{ style: string; term: string } | null>(null)
  const [result, setResult] = useState<{ failed: SetList; passed: SetList }>({ failed: [], passed: [] })
  const [isFinish, setFinish] = useState(false)
  const [amount, setAmount] = useState('5')
  const [attempt, setAttempt] = useState(0)

  const activities = use(ActivityTypesContext) as { activityTypes: ActivityType[] } | null

  useEffect(() => {
    const startArr = getShuffledArr(list).slice(0, +amount)
    const randomIdx = randomIndex(startArr.length - 1)

    setShuffledList(startArr)
    setCurrent({ ...startArr[randomIdx], association: '' })
  }, [amount])

  useEffect(() => {
    // set activity for chart
    if (isFinish && !result.failed.length) {
      ;(async () => {
        const activityTypeId = activities?.activityTypes.find((item) => item.name === ACTIVITIES_NAMES.associations)?.id

        await createActivity(activityTypeId!, data.id)
      })()
    }
  }, [isFinish])

  useEffect(() => {
    if (!shuffledList.length) {
      const startArr = getShuffledArr(list).slice(0, 5)
      const randomIdx = startArr.length > 1 ? randomIndex(startArr.length - 1) : 0

      setShuffledList(startArr)
      setCurrent({ ...startArr[randomIdx], association: '' })
    }
  }, [shuffledList])

  useEffect(() => {
    if (current?.term && !isFinish) {
      ;(async () => {
        try {
          const res = await fetch(associationsApiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: current.term }),
          })

          if (!res.ok) throw Error('Error to get associations')

          const reader = res.body!.getReader()
          const decoder = new TextDecoder()
          let done = false

          while (!done) {
            const { value, done: doneReading } = await reader.read()

            done = doneReading

            const chunkValue = decoder.decode(value)

            setCurrent((prev) => ({
              ...prev,
              term: prev!.term,
              definition: prev!.definition,
              association: prev!.association + chunkValue,
            }))

            // delay to display stream
            await new Promise((r) => setTimeout(r, delay))
          }
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [current?.term, isFinish])

  const onRefresh = () => {
    if (!current?.association) return

    const startArr = getShuffledArr(data.list).slice(0, +amount)
    const randomIdx = startArr.length > 1 ? randomIndex(startArr.length - 1) : 0

    setCurrent({ ...startArr[randomIdx], association: '' })
    setList(data.list)
    setShuffledList(startArr)
    setResult({ failed: [], passed: [] })
    setAttempt(0)
  }

  const onStartOver = (action: 'start' | 'repeat') => {
    const startArr =
      action === 'repeat' ? getShuffledArr(result.failed.slice(0, +amount)) : getShuffledArr(data.list).slice(0, +amount)
    const randomIdx = startArr.length > 1 ? randomIndex(startArr.length - 1) : 0

    setCurrent({ ...startArr[randomIdx], association: '' })
    setList(action === 'repeat' ? result.failed : data.list)
    setShuffledList(startArr)
    setResult({ passed: [], failed: [] })
    setFinish(false)
    setAttempt(0)
  }

  const onChoose = (item: SetListItem) => {
    if (result.passed.find((item) => item.term === current?.term) || result.failed.find((item) => item.term === current?.term))
      return

    const chosenArr = [...result.failed.map((item) => item.term), ...result.passed.map((item) => item.term), current!.term]
    const filtered = [...list.filter((item) => !chosenArr.includes(item.term))].slice(0, +amount)
    const isLast = shuffledList.length === 1
    const randomIdx = filtered.length > 1 ? randomIndex(filtered.length - 1) : 0

    if (item.term === current?.term) {
      setSelectedAnswerStyle({ style: '!bg-success hover:!text-success-foreground text-success-foreground', term: item.term })
      setResult({ ...result, passed: [...result.passed, item] })

      setTimeout(() => {
        setSelectedAnswerStyle(null)
        setShuffledList(getShuffledArr(filtered))
        setCurrent({ ...getShuffledArr(filtered)[randomIdx], association: '' })
        setFinish(isLast)
        setAttempt(0)
      }, 1000)
    } else {
      setSelectedAnswerStyle({
        style: '!bg-destructive hover:!text-destructive-foreground text-destructive-foreground',
        term: item.term,
      })

      if (attempt < 2 && shuffledList.length > 5) {
        setTimeout(() => {
          setSelectedAnswerStyle(null)
          setAttempt((prev) => prev + 1)
        }, 200)

        return
      }

      setResult({ ...result, failed: [...result.failed, current!] })

      setTimeout(() => setSelectedAnswerStyle({ style: '!bg-success text-success-foreground', term: current!.term }), 1000)
      setTimeout(() => {
        setSelectedAnswerStyle(null)
        setShuffledList(getShuffledArr(filtered))
        setCurrent({ ...getShuffledArr(filtered)[randomIdx], association: '' })
        setFinish(isLast)
        setAttempt(0)
      }, 3000)
    }
  }

  return (
    <div>
      {!isFinish && (
        <>
          <div className="flex flex-col lg:flex-row gap-5 justify-evenly items-center">
            <h2 className="title w-full !truncate mb-0 font-semibold text-center">{data.title}</h2>
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <Button variant="outline" className="pushed-btn col-start-2" onClick={onRefresh} asChild>
                <span>
                  <RefreshCcw />
                  Start / Refresh
                </span>
              </Button>
              <div className="flex gap-2 items-center">
                <span className="text-nowrap">Terms Amount:</span>
                <div className="w-fit">
                  <SelectWrap
                    css="!min-w-[70px]"
                    options={[
                      { label: '5', value: '5' },
                      { label: '10', value: '10', hidden: data.list.length < 10 },
                      { label: '15', value: '15', hidden: data.list.length < 15 },
                      { label: '20', value: '20', hidden: data.list.length < 20 },
                    ]}
                    defaultValue={amount}
                    onValueChange={(amount) => setAmount(amount)}
                    placeholder="Terms amount"
                    label="Terms amount"
                    disabled={!!result.failed.length || !!result.passed.length}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-8 text-lg font-semibold">
            {current?.association ? (
              current.association
            ) : (
              <div className="h-7 flex space-x-2 items-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {shuffledList.map((item, idx) => (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (idx + 0.5) / 15, type: 'spring', stiffness: 200 }}
                key={item.term + current?.term + amount}
                onClick={() => onChoose(item)}
              >
                <p
                  className={`
                    px-2 py-1 pb-2 cursor-pointer hover:text-muted-foreground/50 hover:scale-110 rounded-3xl text-lg
                    leading-tight font-semibold text-muted-foreground border-primary border-2 duration-300
                    ${selectedAnswerStyle?.term === item.term ? selectedAnswerStyle.style : ''}
                  `}
                >
                  {item.term}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 mx-auto flex items-center gap-1">
            <span className="text-xl font-semibold text-primary">1</span>
            <Progress value={+((100 / list.length) * (result.passed.length + result.failed.length)).toFixed(0)} />
            <span className="text-xl font-semibold text-primary">{list.length}</span>
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
    </div>
  )
}
