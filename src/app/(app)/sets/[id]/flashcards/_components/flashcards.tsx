'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { CircleArrowLeft, CircleArrowRight, Shuffle, Play, Volume2, RotateCcw } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import SelectWrap from '@/components/select-wrap'

import { SetList } from '@/types/models/set'
import { Set } from '@prisma/client'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import useKeyPress from '@/hooks/useKeyPress'
import getShuffledArr from '@/helpers/getShuffledArr'
import { getUtterance, getVoices } from '@/services/speechService'
import { Voices } from '@/types/speech'

export default function Flashcards({ data }: { data: Set }) {
  const [mode, setMode] = useState<'term' | 'definition'>('term')
  const [setList, setSetList] = useState<SetList>(data.list as SetList)
  const [index, setIndex] = useState(0)
  const [variants, setVariants] = useState<Variants | null>(null)
  const [isPlay, setPlay] = useState(false)
  const [isSound, setSound] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'term' | 'definition'>('term')
  const [isSelectOpen, setSelectOpen] = useState(false)
  const [voices, setVoices] = useState<Voices | null>(null)

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const spacePress = useKeyPress(' ')
  const rightPress = useKeyPress('ArrowRight')
  const leftPress = useKeyPress('ArrowLeft')

  useEffect(() => {
    ;(async () => {
      const voices = await getVoices()

      if (voices) setVoices(voices)
    })()
  }, [])

  useEffect(() => {
    let timeout = null

    if (isPlay) {
      timeout = setTimeout(() => {
        if (index + 1 < setList.length) {
          paginate(1)
        } else {
          clearTimeout(timeout!)

          setPlay(false)
          setIndex(0)
        }
      }, 2500)
    }

    return () => clearTimeout(timeout!)
  }, [isPlay, index])

  useEffect(() => {
    if (isSound) sound()
  }, [setList, mode, isSound])

  useEffect(() => {
    if (rightPress) paginate(1)
  }, [rightPress])

  useEffect(() => {
    if (leftPress) paginate(-1)
  }, [leftPress])

  useEffect(() => {
    if ((spacePress || upPress || downPress) && !isSelectOpen) rotate()
  }, [spacePress, upPress, downPress])

  const paginate = (newDirection: number) => {
    if ((index + 1 === setList.length && newDirection > 0) || (index === 0 && newDirection < 0)) return

    setIndex((prev) => (prev + newDirection + setList.length) % setList.length)
    setMode(selectedMode)

    if (isSound && selectedMode === mode) sound(true, index + newDirection, selectedMode)

    const xVariants = {
      hidden: {
        x: newDirection > 0 ? 300 : -300,
        y: -20,
        rotate: newDirection > 0 ? -10 : 10,
        rotateY: newDirection > 0 ? 90 : -90,
        opacity: 0.5,
      },
      visible: { x: 0, y: 0, rotate: 0, rotateY: 0, opacity: 1 },
      exit: { x: newDirection > 0 ? -300 : 300, opacity: 0 },
    }

    setVariants(xVariants)
  }

  const rotate = () => {
    const yVariants = { hidden: { opacity: 0.5, rotateX: 90 }, visible: { rotateX: 0, opacity: 1 }, exit: { opacity: 0.5 } }

    setVariants(yVariants)
    setMode(mode === 'term' ? 'definition' : 'term')
  }

  const shuffle = () => {
    const shuffledArr = getShuffledArr(setList)

    setSetList(shuffledArr as SetList)
    setIndex(0)
    setMode(selectedMode)
  }

  const sound = (isSound: boolean = true, itemIndex: number | null = null, itemMode: 'term' | 'definition' | null = null) => {
    if (isSound) {
      const msg = setList[itemIndex !== null ? itemIndex : index][itemMode || mode]
      const lang = (mode === 'term' ? data.source : data.target) as 'en' | 'ru' | 'ua'

      getUtterance(voices, msg, lang)
    }
  }

  return (
    <>
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
            checkIsActive={(val) => setSelectOpen(val)}
          />
        </div>
      </div>
      <motion.div
        key={index + ' / ' + mode}
        className="max-w-4xl mx-auto p-1 cursor-pointer"
        variants={variants!}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full shadow-xl border-transparent bg-secondary/30" onClick={rotate}>
          <CardContent className="h-80 md:h-96 flex items-center justify-center p-6 overflow-auto text-center">
            <span className="w-full text-3xl">{setList[index][mode]}</span>
          </CardContent>
        </Card>
      </motion.div>
      <div className="w-fit mx-auto mt-2 flex items-center gap-4 relative">
        <span className="absolute left-[-90px] icon-hover" onClick={shuffle}>
          <Shuffle size={20} />
        </span>
        <span
          className={`
            absolute left-[-60px] md:left-[-145px] border-2 rounded-full p-[5px] border-transparent
            icon-hover ${isPlay ? '!border-gray-500 dark:border-gray-500' : ''}
          `}
          onClick={() => setPlay(!isPlay)}
        >
          <Play size={22} />
        </span>
        <CircleArrowLeft
          className={`${index > 0 ? '' : 'text-secondary'}`}
          strokeWidth={1}
          size={40}
          onClick={() => paginate(-1)}
        />
        <span>{index + 1 + ' / ' + setList.length}</span>
        <CircleArrowRight
          className={`${index + 1 < setList.length ? '' : 'text-secondary'}`}
          strokeWidth={1}
          size={40}
          onClick={() => paginate(1)}
        />
        <span
          className="absolute right-[-90px] icon-hover"
          onClick={() => {
            setIndex(0)
            setMode(selectedMode)
          }}
        >
          <RotateCcw size={20} />
        </span>
        <span
          className={`
            absolute right-[-60px] md:right-[-150px] border-2 rounded-full p-[5px] border-transparent
            icon-hover ${isSound ? '!border-gray-500 dark:border-gray-500' : ''}
            `}
          onClick={() => setSound(!isSound)}
        >
          <Volume2 size={25} />
        </span>
      </div>
      <Progress className="max-w-4xl h-1 mx-auto mt-2" value={(100 / setList.length) * (index + 1)} />
    </>
  )
}
