'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { CircleArrowLeft, CircleArrowRight, Shuffle, Play, Volume2, RotateCcw } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { SetList } from '@/types/models/set'
import { Set } from '@prisma/client'
import SelectWrap from '@/components/select-wrap'
import { languageOptions } from '@/utils/constants'
import useKeyPress from '@/hooks/useKeyPress'
import getShuffledArr from '@/helpers/getShuffledArr'

export default function Flashcards({ data }: { data: Set }) {
  const [mode, setMode] = useState<'term' | 'definition'>('term')
  const [setList, setSetList] = useState<SetList>(data.list as SetList)
  const [index, setIndex] = useState(0)
  const [variants, setVariants] = useState<Variants | null>(null)
  const [isPlay, setPlay] = useState(false)
  const [isSound, setSound] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'term' | 'definition'>('term')
  const [isSelectOpen, setSelectOpen] = useState(false)

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const spacePress = useKeyPress(' ')
  const rightPress = useKeyPress('ArrowRight')
  const leftPress = useKeyPress('ArrowLeft')

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
      hidden: { x: newDirection > 0 ? 300 : -300, y: -30, rotate: newDirection > 0 ? -10 : 10, opacity: 0.3 },
      visible: { x: 0, y: 0, rotate: 0, opacity: 1 },
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
      const utterance = new SpeechSynthesisUtterance(setList[itemIndex !== null ? itemIndex : index][itemMode || mode])
      utterance.lang = `${mode === 'term' ? data.source : data.target}`
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      <h2 className="font-semibold text-center">{data.title}</h2>
      <div className="w-fit mx-auto mb-5">
        <SelectWrap
          options={[
            { label: `Term (${languageOptions.find((item) => data.source === item.value)?.label})`, value: 'term' },
            { label: `Definition (${languageOptions.find((item) => data.target === item.value)?.label})`, value: 'definition' },
          ]}
          onValueChange={(val) => setSelectedMode(val as 'term' | 'definition')}
          defaultValue={selectedMode}
          placeholder="Choose mode"
          label="Choose mode"
          checkIsActive={(val) => setSelectOpen(val)}
        />
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
        <Card className="shadow-xl" onClick={rotate}>
          <CardContent className="h-80 flex items-center justify-center p-6 overflow-auto text-center">
            <span className="w-full text-3xl">{setList[index][mode]}</span>
          </CardContent>
        </Card>
      </motion.div>
      <div className="w-fit mx-auto mt-2 flex items-center gap-4 relative">
        <span className="absolute left-[-90px]" onClick={shuffle}>
          <Shuffle size={20} />
        </span>
        <span
          className={`
            absolute left-[-60px] md:left-[-145px] border-2 rounded-full p-[5px] border-transparent
            ${isPlay ? '!border-gray-500 dark:border-gray-500' : ''}
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
          className="absolute right-[-90px]"
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
            ${isSound ? '!border-gray-500 dark:border-gray-500' : ''}
          `}
          onClick={() => setSound(!isSound)}
        >
          <Volume2 size={25} />
        </span>
      </div>
    </>
  )
}
