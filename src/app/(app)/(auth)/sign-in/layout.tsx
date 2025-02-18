import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In', description: 'Sign In page' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-dvh p-5 flex flex-col justify-center items-center">{children}</div>
}
