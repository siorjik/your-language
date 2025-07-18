'use client'

import { useEffect, useState, use } from 'react'
import { motion, Variants } from 'framer-motion'
import { CircleArrowLeft, CircleArrowRight, Shuffle, Play, Volume2, RotateCcw, Lightbulb } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import SelectWrap from '@/components/select-wrap'
import DropdownMenu from './dropdownMenu'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

import partyPopperImg from '@/../public/party-popper.png'

import { SetList } from '@/types/models/set'
import { ActivityType, Set } from '@prisma/client'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import useKeyPress from '@/hooks/useKeyPress'
import getShuffledArr from '@/helpers/getShuffledArr'
import { cancelUtterance, getUtterance, getVoices } from '@/services/speechService'
import { Langs, Voices } from '@/types/speech'
import useDisplayData from '@/hooks/useDisplayData'
import { createActivity } from '@/actions/activity'
import { ActivityTypesContext } from '@/contexts/activity-types-context'

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
  const [isShowDropdownMenu, setShowDropdownMenu] = useState(false)
  const [soundMode, setSoundMode] = useState<{ term: boolean; definition: boolean }>({ term: false, definition: false })
  const [showTooltip, setShowTooltip] = useState(false)

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const spacePress = useKeyPress(' ')
  const rightPress = useKeyPress('ArrowRight')
  const leftPress = useKeyPress('ArrowLeft')

  const { isMobile } = useDisplayData()

  const response = use(ActivityTypesContext) as { activityTypes: ActivityType[] } | null

  useEffect(() => {
    ;(async () => {
      const voices = await getVoices()

      if (voices) setVoices(voices)
    })()

    return () => cancelUtterance()
  }, [])

  useEffect(() => {
    let timeout = null

    // set activity for chart
    if (index + 1 === setList.length) {
      ;(async () => {
        const activityTypeId = response?.activityTypes.find((item) => item.name === 'flashcards')?.id

        await createActivity(activityTypeId!, data.id)
      })()
    }

    if (isPlay) {
      timeout = setTimeout(() => {
        if (index < setList.length) {
          paginate(1)
        } else {
          clearTimeout(timeout!)

          setPlay(false)
        }
      }, 2500)
    }

    return () => clearTimeout(timeout!)
  }, [isPlay, index])

  useEffect(() => {
    if (isSound) sound({})
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
    cancelUtterance()

    const isEnd = index + 1 === setList.length

    if (index === 0 && newDirection < 0) return

    setIndex((prev) => prev + newDirection)

    if (!isEnd) {
      setMode(selectedMode)

      if (isSound && selectedMode === mode) sound({ isSound: true, itemIndex: index + newDirection, itemMode: selectedMode })

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
    } else {
      if (isSound) setSound(false)
    }
  }

  const rotate = () => {
    cancelUtterance()

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

  const sound = ({
    isSound = true,
    itemIndex = null,
    itemMode = null,
    isOneTime = false,
  }: {
    isSound?: boolean
    itemIndex?: number | null
    itemMode?: 'term' | 'definition' | null
    isOneTime?: boolean
  }) => {
    if (isSound && (soundMode[mode || itemMode] || Object.values(soundMode).every((mode) => !mode || isOneTime))) {
      const msg = setList[itemIndex !== null ? itemIndex : index][itemMode || mode]
      const lang = (mode === 'term' ? data.source : data.target) as Langs

      getUtterance(voices, msg, lang)
    }
  }

  const tooltipMode = mode === 'definition' ? 'term' : 'definition'

  return (
    <>
      {index < setList.length ? (
        <>
          <div className="w-full mb-5 flex flex-col md:flex-row justify-evenly items-center">
            <h2 className="title w-full md:w-fit !truncate md:mb-0 font-semibold text-center leading-tight">{data.title}</h2>
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
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full shadow-xl border-transparent bg-secondary/30 relative" onClick={rotate}>
              <CardHeader className="w-full absolute">
                <CardDescription className="flex justify-end">
                  <span
                    className="icon-hover"
                    onClick={(e) => {
                      e.stopPropagation()

                      sound({ isOneTime: true })
                    }}
                  >
                    <Volume2 size={18} />
                  </span>
                  {mode === selectedMode && (
                    <TooltipProvider>
                      <Tooltip
                        open={showTooltip}
                        onOpenChange={() => {
                          if (isMobile) {
                            setShowTooltip(true)

                            setTimeout(() => setShowTooltip(false), 1000)
                          } else setShowTooltip(!showTooltip)
                        }}
                        delayDuration={0.5}
                      >
                        <TooltipTrigger asChild>
                          <span
                            className="icon-hover"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={() => setShowTooltip(true)}
                          >
                            <Lightbulb size={16} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {`
                            ${setList[index][tooltipMode][0]} ...
                            ${setList[index][tooltipMode][setList[index][tooltipMode].length - 1]}
                          `}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardDescription>
              </CardHeader>
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
            icon-hover ${isPlay ? '!border-primary' : ''}
          `}
              onClick={() => setPlay(!isPlay)}
            >
              <Play size={22} />
            </span>
            <CircleArrowLeft
              className={`${index > 0 ? 'text-primary' : 'text-secondary'}`}
              strokeWidth={1}
              size={40}
              onClick={() => paginate(-1)}
            />
            <span className="text-primary">{index + 1 + ' / ' + setList.length}</span>
            <CircleArrowRight className="text-primary" strokeWidth={1} size={40} onClick={() => paginate(1)} />
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
            icon-hover ${isSound ? '!border-primary' : ''}
          `}
              onMouseLeave={() => setShowDropdownMenu(false)}
              onClick={(e) => {
                if (!isShowDropdownMenu) setShowDropdownMenu(true)

                const el = e.target as HTMLSpanElement

                if (el.tagName !== 'DIV') setSound(!isSound)
              }}
            >
              {isMobile ? (
                <Volume2 size={25} />
              ) : (
                <DropdownMenu
                  trigger={<Volume2 size={25} />}
                  setShowDropdownMenu={setShowDropdownMenu}
                  setSoundMode={setSoundMode}
                  soundMode={soundMode}
                  isShowDropdownMenu={isShowDropdownMenu}
                  dataSource={data.source as Langs}
                  dataTarget={data.target as Langs}
                />
              )}
            </span>
          </div>
          <Progress className="max-w-4xl h-1 mx-auto mt-2" value={(100 / setList.length) * (index + 1)} />
        </>
      ) : (
        <div className="w-fit mt-5 mx-auto text-xl font-semibold">
          Nice job <span className="emoji">👍</span>
          {'! '}
          <span className="link" onClick={() => setIndex(0)}>
            Refresh flashcards
          </span>
          <Image className="mt-20 mx-auto" src={partyPopperImg} alt="party" width={200} height={200} />
        </div>
      )}
    </>
  )
}
