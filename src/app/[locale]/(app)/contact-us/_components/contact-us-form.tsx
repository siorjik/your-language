'use client'

import z from 'zod'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import SimpleForm from '@/components/forms/simple-form'

import { contactUsFormTypeSchema } from '@/types/forms/contact-us'
import { useToast } from '@/hooks/use-toast'
import apiRequestService from '@/services/apiRequestService'
import { emailContactUsApiPath } from '@/utils/paths'

export default function ContactUsForm() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const t = useTranslations('form')
  const tToast = useTranslations('toast.contactUs')

  const submit = async (data: z.infer<typeof contactUsFormTypeSchema>): Promise<boolean> => {
    try {
      await apiRequestService({ url: emailContactUsApiPath, method: 'POST', body: data })

      toast({ title: tToast('success.title'), description: tToast('success.description'), variant: 'success' })

      return true
    } catch (error) {
      console.log(error)

      toast({ title: tToast('destructive.title'), description: tToast('destructive.description'), variant: 'destructive' })

      return false
    }
  }

  const fieldsData = [
    { name: 'email', label: `${t('email')}*` },
    { name: 'subject', label: `${t('subject')}*` },
    { name: 'text', label: `${t('message')}*`, type: 'textarea' },
  ]

  return (
    <div className="w-full lg:w-1/2">
      <SimpleForm
        btn={{ text: t('submit') }}
        fieldsData={fieldsData}
        submit={submit}
        schema={contactUsFormTypeSchema}
        data={{ email: session?.user.email || '', subject: '', text: '' }}
        isReset
        showLoader
      />
    </div>
  )
}
