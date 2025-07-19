import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'

import { newSetAppPath, setsAppPath } from '@/utils/paths'

export default function Library() {
  return (
    <>
      <div className="mx-auto w-fit sub-title-1 mb-10">Your powerful helpers:</div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <Link className="w-full" href={setsAppPath}>
            <Button variant="outline" className="w-full text-primary hover:border-primary hover:bg-initial bg-animated text-lg">
              Go To Sets
            </Button>
          </Link>
          <Card className="max-w-[500px] mt-5 flex flex-col justify-between bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🔥 Sets</CardTitle>
              <CardDescription className="text-center italic">
                One of the most powerful features to expend your vocabulary
              </CardDescription>
            </CardHeader>
            <CardContent className="italic font-semibold text-muted-foreground">
              <p>
                A Set is a structured group of words or expressions that helps you learn and retain new vocabulary more
                effectively. Each Set can be focused on a specific topic - like food, travel, emotions, or business language - so
                you can learn in a meaningful and practical context.
              </p>
              <p className="my-3 text-foreground">Every Set includes:</p>
              <p className="text-primary">⭐️ Flashcards:</p>
              <p className="mt-1 mb-3">
                Review each word or phrase with a clean, distraction-free flashcard interface. You`ll see the term on one side and
                its meaning, translation, or example sentence on the other. Flip through at your own pace or use spaced repetition
                to optimize your memory.
              </p>
              <p className="text-primary">⭐️ Memorization:</p>
              <p className="mt-1 mb-3">
                Train your brain to recall words without seeing them. This test mode uses multiple-choice questions, matching
                tasks, and fill-in-the-blanks to challenge what you`ve retained. It`s a key step in moving words from passive
                recognition to active recall.
              </p>
              <p className="text-primary">⭐️ Spelling:</p>
              <p>
                Practice writing new vocabulary correctly. You`ll hear the word (or see its translation/definition), then be asked
                to type it out from memory. This strengthens spelling, listening, and recall all at once.
              </p>
              <p className="mt-5 text-foreground">
                Using Sets, you`re not just memorizing words - you`re building real, usable language skills. Whether you`re a
                beginner or brushing up your fluency, Sets give you a focused, efficient, and enjoyable learning path.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mx-auto pushed-btn bg-transparent text-primary" asChild>
                <Link href={newSetAppPath}>Create a new one</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
