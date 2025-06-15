import { Voices } from '@/types/speech'

export const getVoices = async (): Promise<Voices> => {
  const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length) {
        resolve(voices)
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices())
        }
      }
    })
  }

  const voices = await loadVoices()

  return {
    en: voices.find((voice) => voice.name === 'Nicky') || null,
    ru: voices.find((voice) => voice.lang === 'ru-RU') || null,
    ua: voices.find((voice) => voice.name === 'Lesya') || null,
  }
}

export const getUtterance = (voices: Voices | null = null, msg: string, lang: 'en' | 'ru' | 'ua') => {
  const utterance = new SpeechSynthesisUtterance(msg)

  if (voices) utterance.voice = voices ? voices[lang] : null

  utterance.lang = lang

  speechSynthesis.speak(utterance)
}
