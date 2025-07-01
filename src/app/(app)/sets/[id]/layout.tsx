import { ReactNode } from 'react'

import { ActivityTypesProvider } from '@/contexts/activity-types-context'

export default function Layout({ children }: { children: ReactNode }) {
  return <ActivityTypesProvider>{children}</ActivityTypesProvider>
}
