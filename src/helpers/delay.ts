const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async (ms: number) => {
  console.log(`Waiting ${ms} seconds...`)

  await delay(ms)

  console.log(`Function executed after ${ms} seconds`)
}
