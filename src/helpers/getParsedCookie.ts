export default (cookie: string, name: string): string => {
  const cookieObj = cookie.split('; ').reduce(
    (acc, current) => {
      const pairArr = current.split('=')

      acc[pairArr[0]] = pairArr[1]

      return acc
    },
    {} as { [k: string]: string },
  )

  return cookieObj[name]
}
