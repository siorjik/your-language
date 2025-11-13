import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

import { LANGUAGE_OPTIONS } from '@/utils/constants'

const getMappedTranslates = (data: string[]): string[] => {
  let res: string[] = []

  data.forEach((word, index) => {
    if (!res.find((item) => item.split(', ').includes(word))) {
      res = res.length > 0 ? [...res, res[index - 1] + ', ' + word] : [word]
    }
  })

  return res
}

export default async (word: string, inputLanguage: string, outputLanguage: string) => {
  const system = 'You are an expert translator.'

  const input = `
    Translate '${word}' with unique variants
    from ${LANGUAGE_OPTIONS.find((item) => item.value === inputLanguage)?.label.toLowerCase()}
    to ${LANGUAGE_OPTIONS.find((item) => item.value === outputLanguage)?.label.toLowerCase()}.
    Return data in JSON format according following format: { translates: string[] }.
  `

  const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-4o-mini', maxTokens: 150 })

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({ translates: z.array(z.string()).describe('The list of translated texts') }),
  )

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', system],
    ['user', '{input}'],
  ])

  const chain = prompt.pipe(model).pipe(parser)

  const resp = await chain.invoke({ input })

  return getMappedTranslates(resp.translates)
}
