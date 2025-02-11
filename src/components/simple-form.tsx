'use client'

import { useForm } from 'react-hook-form'
import z, { ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from './spinner'

type SimpleFormPropsType = {
  submit: (data: z.infer<ZodSchema>) => Promise<void>
  fieldsData: { name: string; label: string; type?: string }[]
  btnText: string
  data?: z.infer<ZodSchema>
  schema: ZodSchema
  showSpinner?: boolean
}

export default function SimpleForm(props: SimpleFormPropsType) {
  const { submit, fieldsData, btnText, data = null, showSpinner = false, schema } = props

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: data })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (values: z.infer<typeof schema>) => submit(values)

  return (
    <>
      <Form {...form}>
        <form
          className="w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {fieldsData.map((item, idx) => {
            if (!item.type) item.type = 'text'

            return (
              <div
                className="mb-5"
                key={idx}
              >
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input
                          type={item.type}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )
          })}
          <div className="flex justify-center">
            <Button
              className="w-full"
              type="submit"
            >
              {btnText || 'Submit'}
            </Button>
          </div>
        </form>
      </Form>

      {showSpinner && isSubmitting && <Spinner />}
    </>
  )
}
