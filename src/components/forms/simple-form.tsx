'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z, { ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from '../spinner'

type FieldsDataType = { name: string; label: string; type?: string; hidden?: boolean }[]
type SimpleFormPropsType = {
  submit: (data: z.infer<ZodSchema>) => Promise<boolean>
  fieldsData: FieldsDataType
  btn?: { text?: string; css?: string }
  data?: z.infer<ZodSchema>
  schema: ZodSchema
  showSpinner?: boolean
  isReset?: boolean
  isDisabled?: boolean
  onSuccess?: () => void
  showLoader?: boolean
}

export default function SimpleForm(props: SimpleFormPropsType) {
  const [isErr, setErr] = useState<boolean>(false)

  const {
    submit,
    fieldsData,
    btn,
    data = null,
    showSpinner = false,
    schema,
    isReset = false,
    isDisabled = false,
    onSuccess,
    showLoader = false,
  } = props

  const getDefaultValues = () => {
    return fieldsData.reduce(
      (acc, current) => {
        if (!acc[current.name]) {
          acc[current.name] = ''

          return acc
        } else return acc
      },
      {} as { [k: string]: string },
    )
  }

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: data || getDefaultValues() })

  const {
    reset,
    formState: { isSubmitting, isSubmitted, dirtyFields },
    getValues,
  } = form

  useEffect(() => {
    if (isDisabled && !isSubmitted) reset()
  }, [isDisabled])

  const onSubmit = async (values: z.infer<typeof schema>): Promise<void> => {
    setErr(() => false)

    try {
      const res = await submit(values)

      if (!res) setErr(() => true)

      if (isReset && res) {
        reset()

        reset({ ...getValues(), dirtyFields: {} })
      }

      if (onSuccess) onSuccess()

      // reset({ ...getValues(), dirtyFields: {} })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          {fieldsData.map((item, idx) => {
            if (!item.type) item.type = 'text'

            return (
              <div className="mb-5" key={idx}>
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({ field }) => {
                    return (
                      <>
                        {!item.hidden && (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input type={item.type} disabled={isDisabled} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      </>
                    )
                  }}
                />
              </div>
            )
          })}
          {((!isDisabled && Object.keys(dirtyFields).length > 0) || isErr) && (
            <Button className={`${btn?.css || 'w-full'}`} type="submit" disabled={isSubmitting}>
              {btn?.text || 'Submit'} {isSubmitting && showLoader && <Loader2 className="animate-spin" />}
            </Button>
          )}
        </form>
      </Form>

      {showSpinner && isSubmitting && <Spinner />}
    </>
  )
}
