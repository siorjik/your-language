'use client'

import { createContext, ReactNode, useCallback, useMemo, useState } from 'react'

export type ModalContextType = {
  isModalOpen: Record<string, boolean>
  setModalVisibility: (name: string, isOpen: boolean) => void
}

export const ModalContext = createContext<ModalContextType>({ isModalOpen: {}, setModalVisibility: () => {} })

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState<Record<string, boolean>>({})

  const setModalVisibility = useCallback(
    (name: string, isOpen: boolean) => {
      const modalData = { ...isModalOpen }

      if (!isOpen) delete modalData[name]
      else modalData[name] = true

      setModalOpen(modalData)
    },
    [isModalOpen],
  )

  const data = useMemo(() => ({ isModalOpen, setModalVisibility }), [isModalOpen])

  return <ModalContext value={data}>{children}</ModalContext>
}
