'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon, CirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Select from '../select-wrap'
import { Button } from '../ui/button'
import Autocomplete from '../autocomplete'
import Spinner from '../spinner'

import { setFormTypeSchema } from '@/types/forms/set'
import apiRequestService from '@/services/apiRequestService'
import { dictionaryApiPath, getSetAppPath, setsAppPath, translateApiPath } from '@/utils/paths'
import { LANGUAGE_OPTIONS } from '@/utils/constants'
import { createSet, updateSet } from '@/actions/set'
import { Err } from '@/types/errTypes'
import { toast } from '@/hooks/use-toast'
import dictionaryService from '@/services/dictionaryService'
import { SelectedSet } from '@/types/models/set'

const defaultValues = { list: [{ term: '', definition: '' }], title: '', source: '', target: '' }

type DataType = { name: string; words: string[] }
type SetFormProps = {
  data?: (SelectedSet & z.infer<typeof setFormTypeSchema>) | null
  action?: 'create' | 'update' | null
  btnStyle?: string
  afterSubmitFn?: () => void
}

export default function SetForm({ data = null, action = null, btnStyle = '', afterSubmitFn }: SetFormProps) {
  const [dictionary, setDictionary] = useState<DataType>({ name: '', words: [] })
  const [translate, setTranslate] = useState<DataType>({ name: '', words: [] })

  const { push } = useRouter()

  const timeoutRef: { current: NodeJS.Timeout | null } = useRef(null)
  const translateRef = useRef<(HTMLInputElement | null)[]>([])
  const dictionaryRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    form.setFocus('title')
  }, [])

  const form = useForm<z.infer<typeof setFormTypeSchema>>({
    resolver: zodResolver(setFormTypeSchema),
    defaultValues: data || defaultValues,
  })

  const { fields, remove, append } = useFieldArray({ name: 'list', control: form.control })

  const onSubmit = async (values: z.infer<typeof setFormTypeSchema>): Promise<void> => {
    const res: (SelectedSet & { error: null }) | Err = action === 'create' ? await createSet(values) : await updateSet(values)

    if (!res.error) {
      if (action === 'create') push(setsAppPath)
      else {
        if (!afterSubmitFn) push(getSetAppPath(res.id))
        else afterSubmitFn()
      }
    } else
      toast({
        title: action === 'create' ? 'Set Creation Error' : 'Set Updating Error',
        variant: 'destructive',
        description: res.error.message,
      })
  }

  const handleChange = useCallback(async (val: string, name: string): Promise<void> => {
    let words: string[] | [] = []

    clearTimeout(timeoutRef.current as NodeJS.Timeout)

    timeoutRef.current = setTimeout(async () => {
      try {
        if (form.getValues('source') === 'en') {
          const res: { words: string[] } = await dictionaryService(val)

          words = res.words
        } else {
          words = await apiRequestService({
            url: dictionaryApiPath,
            method: 'POST',
            body: { word: val, language: form.getValues('source') },
          })
        }

        setDictionary({ name, words })
      } catch (error) {
        console.log(error)
      }
    }, 600)
  }, [])

  const setTranslates = async (val: string, name: string): Promise<void> => {
    if (!val) return

    try {
      const words: string[] = await apiRequestService({
        url: translateApiPath,
        method: 'POST',
        body: { word: val, inputLanguage: form.getValues('source'), outputLanguage: form.getValues('target') },
      })

      setTranslate({ name, words })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form>
          <div className="flex flex-col md:flex-row gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!action} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-10 w-10 text-center pt-2 mx-auto md:mt-7 border-2 rounded-md text-xs leading-[.6] font-semibold">
              <span className="text-sm leading-[.3]">{fields.length}</span>
              <p>items</p>
            </div>
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Source*</FormLabel>
                  <FormControl>
                    <Select
                      options={LANGUAGE_OPTIONS}
                      placeholder="Choose source"
                      onValueChange={(val) => {
                        if (val === form.getValues('target')) {
                          form.setError('source', { message: 'Need to be different than target' })
                        } else if (form.formState.errors.source || form.formState.errors.target) {
                          form.clearErrors('source')
                          form.clearErrors('target')
                        }

                        form.setValue('source', val as string)
                      }}
                      defaultValue={field.value}
                      disabled={fields.length > 1 || !action}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Target*</FormLabel>
                  <FormControl>
                    <Select
                      options={LANGUAGE_OPTIONS}
                      placeholder="Choose target"
                      onValueChange={(val) => {
                        if (val === form.getValues('source')) {
                          form.setError('target', { message: 'Need to be different than source' })
                        } else if (form.formState.errors.source || form.formState.errors.target) {
                          form.clearErrors('source')
                          form.clearErrors('target')
                        }

                        form.setValue('target', val as string)
                      }}
                      defaultValue={field.value}
                      disabled={fields.length > 1 || !action}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {fields.map((field, idx) => {
            return (
              <div
                key={field.id}
                className="
                  mt-3 p-3 flex flex-col md:flex-row items-center md:items-stretch gap-3 bg-secondary/20 shadow-md rounded-md
                "
              >
                {fields.length > 1 && <span className="md:mt-9 text-sm font-semibold text-primary">{idx + 1}</span>}
                <FormField
                  control={form.control}
                  name={`list.${idx}.term`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Term*</FormLabel>
                      <FormControl>
                        <Autocomplete
                          value={field.value}
                          handleChange={(val) => handleChange(val, field.name)}
                          getValue={(val) => {
                            form.setValue(field.name, val)

                            setTranslates(val, `list.${idx}.definition`)

                            translateRef.current[idx]!.focus()

                            setTranslate({ ...translate, words: ['Loading...'] })
                            setDictionary({ name: '', words: [] })
                          }}
                          data={dictionary.words}
                          disabled={!(form.getValues('source') && form.getValues('target')) || !action}
                          placeholder={
                            !(form.getValues('source') && form.getValues('target'))
                              ? 'Choose language source and target'
                              : 'Text Term'
                          }
                          ref={dictionaryRef}
                        />
                      </FormControl>
                      <FormDescription>
                        from: {LANGUAGE_OPTIONS.find((item) => item.value === form.watch('source'))?.label}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`list.${idx}.definition`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Definition*</FormLabel>
                      <FormControl>
                        <Autocomplete
                          value={field.value}
                          getValue={(val) => {
                            if (field.name === translate.name) {
                              form.setValue(field.name, val)

                              setTranslate({ name: '', words: [] })
                            }
                          }}
                          handleChange={(val) => form.setValue(field.name, val)}
                          data={translate.words}
                          ref={(el) => {
                            field.ref(el)

                            translateRef.current[idx] = el
                          }}
                          disabled={!(form.getValues('source') && form.getValues('target')) || !action}
                          placeholder={
                            !(form.getValues('source') && form.getValues('target'))
                              ? 'Choose language source and target'
                              : 'Text Definition'
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        to: {LANGUAGE_OPTIONS.find((item) => item.value === form.watch('target'))?.label}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && action && (
                  <Button
                    type="button"
                    className="md:mt-8 p-0 w-fit h-fit hover:bg-transparent text-primary hover:text-destructive"
                    variant="ghost"
                    onClick={() => remove(idx)}
                  >
                    <TrashIcon style={{ height: '22px', width: '22px' }} />
                  </Button>
                )}
              </div>
            )
          })}
          {!!form.getValues('source') && form.getValues('target') && action && (
            <Button
              type="button"
              className="mt-3 mx-auto p-0 w-fit h-fit block hover:bg-transparent hover:text-success text-primary"
              variant="ghost"
              onClick={() => {
                append({ term: '', definition: '' })

                setTimeout(() => dictionaryRef.current?.focus(), 200)
              }}
            >
              <CirclePlus style={{ height: '22px', width: '22px' }} />
            </Button>
          )}
          {action && fields.length > 1 && (
            <Button type="button" className={`mt-3 ${btnStyle}`} onClick={form.handleSubmit(onSubmit)}>
              {action === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </form>
      </Form>

      {form.formState.isSubmitting && <Spinner />}
    </>
  )
}
