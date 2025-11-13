import { ChatOpenAI } from '@langchain/openai'
import { SystemMessage, HumanMessage } from '@langchain/core/messages'

export default async (word: string, language: string = 'en') => {
  const sys = new SystemMessage(`
    You are a creative mnemonic creator.
    Given a single word, produce one short, vivid, original association or mnemonic
    to help remember its meaning — but DO NOT mention, restate, or describe the word itself.
    Each time you're asked about the same word, create a DIFFERENT association.
    Be concise, imaginative, and expressive.
    Output only the association text.
  `)

  const human = new HumanMessage(`Language: ${language}\nWord: ${word}\nGenerate a short association:`)

  const model = new ChatOpenAI({ temperature: 0.9, modelName: 'gpt-4o-mini', maxTokens: 100, streaming: true })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await model.stream([sys, human])

        for await (const chunk of response) {
          const textChunk = chunk?.content ?? ''

          if (textChunk) controller.enqueue(encoder.encode(textChunk as string))
        }

        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return stream
}
