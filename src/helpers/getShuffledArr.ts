import { ReactNode } from 'react'

export default (data: ({ [k: string]: string | number } | ReactNode)[]) => {
  const arr = [...data]

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[arr[i], arr[j]] = [arr[j], arr[i]] // swap
  }

  return arr
}
