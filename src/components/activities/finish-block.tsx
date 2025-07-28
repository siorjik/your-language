'use client'

import Image from 'next/image'

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
  return (
    <div className="w-fit mt-5 mx-auto text-xl font-semibold">
      {!isFlashcards ? (
        <>
          Nice job <span className="emoji">👍</span>! Do you want to{' '}
          {!!result?.failed.length && (
            <>
              <span className="link" onClick={repeat}>
                repeat failed
              </span>{' '}
              or{' '}
            </>
          )}
          <>
            <span className="link" onClick={start}>
              start over
            </span>{' '}
            ?
          </>
          {!result?.failed.length && (
            <Image className="mt-20 mx-auto" src={partyPopperImg} alt="party" width={200} height={200} />
          )}
        </>
      ) : (
        <>
          Nice job <span className="emoji">👍</span>
          {'! '}
          <span className="link" onClick={start}>
            Refresh flashcards
          </span>
          <Image className="mt-20 mx-auto" src={partyPopperImg} alt="party" width={200} height={200} />
        </>
      )}
    </div>
  )
}
