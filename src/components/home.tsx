'use client'

import { useState } from 'react'
import { Session } from 'next-auth'

import DialogWrap from './dialog-wrap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import SignInForm from './forms/sign-in-form'
import SignUpForm from './forms/sign-up-form'

export default function Main({ session }: { session: Session | null }) {
  const [isClose, setClose] = useState(false)

  const dialogContent = (
    <Tabs>
      <TabsList className="w-full flex justify-evenly">
        <TabsTrigger value="signIn" className="w-1/2">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signUp" className="w-1/2">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <div className="mt-5 flex justify-center">
          <SignInForm />
        </div>
      </TabsContent>
      <TabsContent value="signUp">
        <div className="mt-5 flex justify-center">
          <SignUpForm isMainPage onSuccess={() => setClose(true)} />
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div>
      {session?.user ? (
        <div>Welcome, {session.user.name}</div>
      ) : (
        <DialogWrap
          title="Welcome!"
          trigger={
            <div>
              <span>Improve your English! Just </span>
              <span className="link">join</span>
            </div>
          }
          content={dialogContent}
          isAutoClose={isClose}
        />
      )}
    </div>
  )
}
