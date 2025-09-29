'use client'

import { createContext, ReactNode, useState } from 'react'

export type ModalContextType = { isModalOpen: boolean; setModalVisibility: (val: boolean) => void }

export const ModalContext = createContext<ModalContextType>({ isModalOpen: false, setModalVisibility: () => {} })

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const setModalVisibility = (val: boolean) => setModalOpen(val)

  return <ModalContext value={{ isModalOpen, setModalVisibility }}>{children}</ModalContext>
}
