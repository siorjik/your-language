'use client'

import { useEffect, useState, use, useCallback, useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { CircleArrowLeft, CircleArrowRight, Shuffle, Play, Volume2, RotateCcw, Lightbulb } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import SelectWrap from '@/components/select-wrap'
import DropdownMenu from './dropdownMenu'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import FinishBlock from '../finish-block'

import { SelectedSet, SetList, SetListItem } from '@/types/models/set'
import { ActivityType } from '@prisma/client'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import useKeyPress from '@/hooks/useKeyPress'
import getShuffledArr from '@/helpers/getShuffledArr'
import { cancelUtterance, getUtterance, getVoices } from '@/services/speechService'
import { Langs, Voices } from '@/types/speech'
import useDisplayData from '@/hooks/useDisplayData'
import { createActivity } from '@/actions/activity'
import { ActivityTypesContext } from '@/contexts/activity-types-context'
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'

export default function Flashcards({ data, isComboOpen }: { data: SelectedSet; isComboOpen?: boolean }) {
  const [mode, setMode] = useState<'term' | 'definition'>('term')
  const [setList, setSetList] = useState<SetList>(data.list)
  const [index, setIndex] = useState(0)
  const [variants, setVariants] = useState<Variants | null>(null)
  const [isPlay, setPlay] = useState(false)
  const [isSound, setSound] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'term' | 'definition'>('term')
  const [isSelectOpen, setSelectOpen] = useState(false)
  const [voices, setVoices] = useState<Voices | null>(null)
  const [isShowDropdownMenu, setShowDropdownMenu] = useState(false)
  const [isShowPlayDropdownMenu, setShowPlayDropdownMenu] = useState(false)
  const [soundMode, setSoundMode] = useState<{ term: boolean; definition: boolean }>({ term: false, definition: false })
  const [showTooltip, setShowTooltip] = useState(false)
  const [isShuffled, setShuffled] = useState(false)
  const [delay, setDelay] = useState(2000)

  const downPress = useKeyPress('ArrowDown', true)
  const upPress = useKeyPress('ArrowUp', true)
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
      }, delay)
    }

    return () => clearTimeout(timeout!)
  }, [isPlay, index])

  useEffect(() => {
    if (isSound) sound({})
  }, [setList, mode, isSound])

  // sound for first element
  useEffect(() => {
    if (isSound && index === 0) sound({})
  }, [index])

  useEffect(() => {
    if (rightPress) paginate(1)
  }, [rightPress])

  useEffect(() => {
    if (leftPress) paginate(-1)
  }, [leftPress])

  useEffect(() => {
    if ((spacePress || upPress || downPress) && !isSelectOpen && !isComboOpen) rotate()
  }, [spacePress, upPress, downPress])

  const paginate = (newDirection: number) => {
    cancelUtterance()

    const isEnd = index + 1 === setList.length

    if (index === 0 && newDirection < 0) return

    setIndex((prev) => prev + newDirection)

    if (!isEnd || (isEnd && newDirection < 0)) {
      setMode(selectedMode)

      if (isSound && selectedMode === mode && index + newDirection !== 0) {
        sound({ isSound: true, itemIndex: index + newDirection, itemMode: selectedMode })
      }

      const xVariants = {
        hidden: {
          x:
            newDirection > 0 && !isMobile ? 300 : newDirection > 0 && isMobile ? 150 : newDirection < 0 && isMobile ? -150 : -300,
          y: -20,
          rotate: newDirection > 0 ? -10 : 10,
          rotateY: newDirection > 0 ? 90 : -90,
        },
        visible: { x: 0, y: 0, rotate: 0, rotateY: 0 },
        exit: { x: newDirection > 0 ? -300 : 300 },
      }

      setVariants(xVariants)
    } else setMode(selectedMode)
  }

  const rotate = () => {
    cancelUtterance()

    const yVariants = { hidden: { rotateX: 180 }, visible: { rotateX: 0 }, exit: { opacity: 0.5 } }

    setVariants(yVariants)
    setTimeout(() => setMode(mode === 'term' ? 'definition' : 'term'))
  }

  const shuffle = (isShuffled: boolean) => {
    setShuffled(isShuffled)
    setSetList(isShuffled ? getShuffledArr<SetListItem>(setList) : data.list)
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

  const soundMenuItems = useMemo(
    () => [
      <DropdownMenuCheckboxItem
        key="term"
        checked={soundMode.term}
        onCheckedChange={() => setSoundMode({ ...soundMode, term: !soundMode.term })}
      >
        {`Term (${LANGUAGE_OPTIONS.find((item) => data.source === item.value)?.label})`}
      </DropdownMenuCheckboxItem>,
      <DropdownMenuCheckboxItem
        key="definition"
        checked={soundMode.definition}
        onCheckedChange={() => setSoundMode({ ...soundMode, definition: !soundMode.definition })}
      >
        {`Definition (${LANGUAGE_OPTIONS.find((item) => data.target === item.value)?.label})`}
      </DropdownMenuCheckboxItem>,
    ],
    [soundMode],
  )

  const playMenuItems = useMemo(
    () => [
      <DropdownMenuCheckboxItem key="1s" checked={delay === 1000} onCheckedChange={() => setDelay(1000)}>
        1s
      </DropdownMenuCheckboxItem>,
      <DropdownMenuCheckboxItem key="2s" checked={delay === 2000} onCheckedChange={() => setDelay(2000)}>
        2s
      </DropdownMenuCheckboxItem>,
      <DropdownMenuCheckboxItem key="3s" checked={delay === 3000} onCheckedChange={() => setDelay(3000)}>
        3s
      </DropdownMenuCheckboxItem>,
    ],
    [delay],
  )

  const setShowDropdownMenuPlayCallback = useCallback(() => setShowPlayDropdownMenu((prev) => !prev), [])
  const setShowDropdownMenuCallback = useCallback(() => setShowDropdownMenu((prev) => !prev), [])

  const playTrigger = useMemo(() => <Play size={22} />, [])
  const soundTrigger = useMemo(() => <Volume2 size={23} />, [])

  const tooltipMode = mode === 'definition' ? 'term' : 'definition'

  return (
    <>
      {index < setList.length ? (
        <>
          <div className="w-full mb-5 flex flex-col md:flex-row justify-evenly items-center">
            <h2 className="title w-full md:w-fit !truncate md:mb-0 text-center">{data.title}</h2>
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
            className="max-w-5xl mx-auto p-1 cursor-pointer"
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
                      <Tooltip open={showTooltip} onOpenChange={setShowTooltip} delayDuration={10000}>
                        <TooltipTrigger asChild>
                          <span
                            className="icon-hover"
                            onClick={(e) => {
                              e.stopPropagation()

                              setShowTooltip(true)
                              setTimeout(() => setShowTooltip(false), 2000)
                            }}
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
              <CardContent
                className="
                  h-80 md:h-[calc(100vh-450px)] md:min-h-[450px] md:max-h-[550px] flex items-center
                  justify-center p-6 overflow-auto text-center
                "
              >
                <motion.span
                  key={mode}
                  initial={{ opacity: !variants ? 1 : 0 }} // avoid flickering when first render
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.03 }}
                  className="w-full text-primary/90 text-3xl md:text-4xl !leading-normal"
                >
                  {setList[index][mode]}
                </motion.span>
              </CardContent>
            </Card>
          </motion.div>
          <div className="w-fit mx-auto mt-2 flex items-center gap-5 md:gap-10">
            <div className="flex md:gap-5">
              <span
                className={`border-2 rounded-full p-[5px] border-transparent icon-hover ${isPlay ? '!border-primary' : ''}`}
                onMouseLeave={() => setShowPlayDropdownMenu(false)}
                onClick={(e) => {
                  if (!isShowPlayDropdownMenu) setShowPlayDropdownMenu(true)

                  const el = e.target as HTMLSpanElement

                  if (el.tagName !== 'DIV') setPlay(!isPlay)
                }}
              >
                {isMobile ? (
                  <Play size={22} />
                ) : (
                  <DropdownMenu
                    title="Choose delay:"
                    items={playMenuItems}
                    trigger={playTrigger}
                    setShowDropdownMenu={setShowDropdownMenuPlayCallback}
                    isShowDropdownMenu={isShowPlayDropdownMenu}
                  />
                )}
              </span>
              <span
                className={`p-[6px] icon-hover border-2 rounded-full border-transparent ${isShuffled ? '!border-primary' : ''}`}
                onClick={() => shuffle(!isShuffled)}
              >
                <Shuffle size={18} />
              </span>
            </div>
            <div className="flex gap-1 md:gap-5 items-center">
              <CircleArrowLeft
                className={`${index > 0 ? 'text-primary' : 'text-secondary'}`}
                strokeWidth={1}
                size={40}
                onClick={() => paginate(-1)}
              />
              <span className="text-primary font-semibold">{index + 1 + ' / ' + setList.length}</span>
              <CircleArrowRight className="text-primary" strokeWidth={1} size={40} onClick={() => paginate(1)} />
            </div>
            <div className="flex md:gap-5">
              <span
                className="icon-hover"
                onClick={() => {
                  setIndex(0)
                  setMode(selectedMode)
                }}
              >
                <RotateCcw size={20} />
              </span>
              <span
                className={`border-2 rounded-full p-[5px] border-transparent icon-hover ${isSound ? '!border-primary' : ''}`}
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
                    title="Choose speech mode:"
                    items={soundMenuItems}
                    trigger={soundTrigger}
                    setShowDropdownMenu={setShowDropdownMenuCallback}
                    isShowDropdownMenu={isShowDropdownMenu}
                  />
                )}
              </span>
            </div>
          </div>
          <Progress className="max-w-5xl h-1 mx-auto mt-2" value={(100 / setList.length) * (index + 1)} />
        </>
      ) : (
        <FinishBlock start={() => setIndex(0)} isFlashcards />
      )}
    </>
  )
}
