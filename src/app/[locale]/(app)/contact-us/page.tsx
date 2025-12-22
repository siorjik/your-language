import { getTranslations } from 'next-intl/server'

import ContactUsForm from './_components/contact-us-form'

export default async function ContactUs() {
  const t = await getTranslations('ContactUs')

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="w-fit sub-title-1 text-center">{t('title')}</h2>
      <ContactUsForm />
    </div>
  )
}
