import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { GlowEffect } from '@/components/ui/glow-effect'

import { activitiesAppPath, classesAppPath, newSetAppPath, setsAppPath } from '@/utils/paths'

export default function Library() {
  return (
    <>
      <h2 className="mx-auto w-fit title">Your helpers</h2>
      <div className="flex flex-col md:flex-row flex-wrap xl:flex-nowrap justify-center gap-8">
        <div className="flex flex-col items-center">
          <Link className="w-full" href={setsAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated">
              Go To Sets
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🔥 Sets</CardTitle>
              <CardDescription className="text-center italic">
                One of the most powerful features to expend your vocabulary.
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
              <div className="mx-auto relative">
                <GlowEffect className="rounded-md" mode="flowHorizontal" blur="soft" duration={5} scale={1} />
                <Button asChild className="relative m-[2px]">
                  <Link href={newSetAppPath}>Create a new one</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col items-center">
          <Link className="w-full" href={activitiesAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated">
              Go To Activities
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🧠 Activities</CardTitle>
              <CardDescription className="text-center italic">
                Training with exercises that cover learning aspects.
              </CardDescription>
            </CardHeader>
            <CardContent className="italic font-semibold text-muted-foreground">
              <p>
                The Activity page is where you actively engage with the vocabulary sets you`ve created. Each set contains pairs of
                terms and definitions, and you can choose how to practice them through three interactive modes:
              </p>
              <p className="my-3 text-foreground">☝️ How It Works:</p>
              <p>
                <span className="not-italic">1️⃣</span> Choose a Set - select a vocabulary set that contains your terms and
                definitions.
              </p>
              <p className="my-3">
                <span className="not-italic">2️⃣</span> Pick an Activity Mode - switch between Flashcards, Memorization, or
                Spelling depending on your learning goal.
              </p>
              <p>
                <span className="not-italic">3️⃣</span> Track Your Learning - each mode reinforces memory in a unique way, giving
                you a balanced approach to mastering your vocabulary.
              </p>
              <p className="my-5">
                <span className="not-italic">📊</span> Each passed activity will be tracked by your Progress Activity Chart.
              </p>
              <p className="mt-5 text-foreground">
                It`s the fastest access to your exercises and this makes the Activity page a flexible practice hub - you decide
                whether to review, test, or drill spelling for any of your sets.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center">
          <Link className="w-full" href={classesAppPath}>
            <Button variant="outline" className="w-full btn-bg-animated">
              Go To Classes
            </Button>
          </Link>
          <Card className="min-w-[300px] max-w-[450px] h-full mt-3 flex flex-col bg-accent/30 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-primary text-center">🚀 Classes</CardTitle>
              <CardDescription className="text-center italic">
                Create a personal study space with your friends and enjoy learn process together!
              </CardDescription>
            </CardHeader>
            <div className="h-full flex flex-col justify-between">
              <CardContent className="italic font-semibold text-muted-foreground">
                <p>
                  Classes are your own study spaces where you can learn languages with friends, classmates, or even the whole
                  community. It`s like having your personal study club — right inside the app!
                </p>
                <p className="my-3 text-foreground">
                  <span className="not-italic">🔑</span> Key Features:
                </p>
                <p className="text-primary mb-1">
                  <span className="not-italic font-emoji">👩‍🏫</span> Create Your Own Class
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✅</span> Start a new class in just a few taps.
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✅</span> Choose the name, invite people, and organize everything in one
                  place.
                </p>
                <p>
                  <span className="not-italic font-emoji">✅</span> Perfect for teachers{' '}
                  <span className="not-italic font-emoji">👨‍🏫</span>, group leaders, or anyone who loves collaborative learning!
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">🤝</span> Invite & Join
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">☄️</span> Share a link
                  <span className="not-italic font-emoji">🔗</span> and let friends, classmates, or learners from all over the
                  world join.
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">☄️</span> Or join existing classes to connect with people who share your
                  language goals.
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">📚</span> Shared Study Sets
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">💥</span> Upload your flashcards, quizzes, and spelling activities and
                  share them with the class.
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">💥</span> Everyone learns from the same content, making it easier to
                  study together.
                </p>

                <p className="text-primary mt-4 mb-1">
                  <span className="not-italic font-emoji">🎮</span> Train & Compete
                </p>
                <p className="my-2 font-semibold text-foreground">Practice together with interactive activities:</p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">🃏</span> Flashcards to memorize words
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">❓</span> Quizzes to test knowledge
                </p>
                <p className="mb-1">
                  <span className="not-italic font-emoji">✍️</span> Spelling challenges to boost accuracy
                </p>
              </CardContent>
              <CardFooter>
                <div className="mx-auto relative">
                  <GlowEffect className="rounded-md" mode="flowHorizontal" blur="soft" duration={5} scale={1} />
                  <Button asChild className="relative m-[2px]">
                    <Link href={classesAppPath}>Create a new one</Link>
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
