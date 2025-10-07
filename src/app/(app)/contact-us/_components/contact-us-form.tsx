'use client'

import z from 'zod'

import SimpleForm from '@/components/forms/simple-form'

import { contactUsFormTypeSchema } from '@/types/forms/contact-us'
import { useToast } from '@/hooks/use-toast'
import apiRequestService from '@/services/apiRequestService'
import { emailContactUsApiPath } from '@/utils/paths'

export default function ContactUsForm() {
  const { toast } = useToast()

  const submit = async (data: z.infer<typeof contactUsFormTypeSchema>): Promise<boolean> => {
    try {
      await apiRequestService({ url: emailContactUsApiPath, method: 'POST', body: data })

      toast({ title: 'Message Sending', description: 'Your message was sent successfully!', variant: 'success' })

      return true
    } catch (error) {
      console.log(error)

      toast({ title: 'Message Sending Error', description: 'Something went wrong with sending...', variant: 'destructive' })

      return false
    }
  }

  const fieldsData = [
    { name: 'email', label: 'Your Email*' },
    { name: 'subject', label: 'Subject*' },
    { name: 'text', label: 'Message*', type: 'textarea' },
  ]

  return (
    <div className="w-full lg:w-1/2">
      <SimpleForm fieldsData={fieldsData} submit={submit} schema={contactUsFormTypeSchema} isReset showLoader />
    </div>
  )
}
