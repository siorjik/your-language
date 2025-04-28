'use client'

import { useState, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon, CirclePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Select from '../select-wrap'
import { Button } from '../ui/button'
import Autocomplete from '../autocomplete'

import { setFormTypeSchema } from '@/types/forms/set'
import apiRequestService from '@/services/apiRequestService'
import { dictionaryApiPath, setAppPath, translateApiPath } from '@/utils/paths'
import { languageOptions } from '@/utils/constants'
import { createSet } from '@/actions/set'
import { Set } from '@prisma/client'
import { Err } from '@/types/errTypes'
import { toast } from '@/hooks/use-toast'

const defaultValues = { list: [{ term: '', definition: '' }], title: '' }

type DataType = { name: string; words: string[] }

export default function SetForm() {
  const [dictionary, setDictionary] = useState<DataType>({ name: '', words: [] })
  const [translate, setTranslate] = useState<DataType>({ name: '', words: [] })

  const { push } = useRouter()

  const timeoutRef: { current: NodeJS.Timeout | null } = useRef(null)
  const translateRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<z.infer<typeof setFormTypeSchema>>({
    resolver: zodResolver(setFormTypeSchema),
    defaultValues: defaultValues,
  })

  const { fields, remove, append } = useFieldArray({ name: 'list', control: form.control })

  const onSubmit = async (values: z.infer<typeof setFormTypeSchema>): Promise<void> => {
    const res: (Set & { error: null }) | Err = await createSet(values)

    if (!res.error) push(setAppPath)
    else toast({ title: 'Set Creation Error', variant: 'destructive', description: res.error.message })
  }

  const handleChange = async (val: string, name: string): Promise<void> => {
    clearTimeout(timeoutRef.current as NodeJS.Timeout)

    timeoutRef.current = setTimeout(async () => {
      try {
        const words: string[] | [] = await apiRequestService({
          url: dictionaryApiPath,
          method: 'POST',
          body: { word: val, language: form.getValues('source') },
        })

        setDictionary({ name, words })
      } catch (error) {
        console.log(error)
      }
    }, 600)
  }

  const setTranslates = async (val: string, name: string): Promise<void> => {
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="py-3 px-4 border self-end rounded-full">{fields.length}</span>
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Source</FormLabel>
                  <FormControl>
                    <Select
                      options={languageOptions}
                      placeholder="Choose source"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={fields.length > 1}
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
                  <FormLabel>Language Target</FormLabel>
                  <FormControl>
                    <Select
                      options={languageOptions}
                      placeholder="Choose target"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={fields.length > 1}
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
                className="mt-3 p-3 flex flex-col md:flex-row items-center md:items-stretch gap-3 bg-slate-50 rounded-md"
              >
                <span className="md:mt-8 text-sm">{idx + 1}</span>
                <FormField
                  control={form.control}
                  name={`list.${idx}.term`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Term</FormLabel>
                      <FormControl>
                        <Autocomplete
                          handleChange={(val) => handleChange(val, field.name)}
                          getValue={(val) => {
                            form.setValue(field.name, val)

                            setTranslates(val, field.name)

                            translateRef.current!.focus()

                            setDictionary({ name: '', words: [] })
                          }}
                          data={dictionary.words}
                          disabled={!(form.getValues('source') && form.getValues('target'))}
                          label={
                            !(form.getValues('source') && form.getValues('target')) ? 'Choose language source and target' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`list.${idx}.definition`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Definition</FormLabel>
                      <FormControl>
                        <Autocomplete
                          handleChange={(val) => handleChange(val, field.name)}
                          getValue={(val) => {
                            form.setValue(field.name, val)

                            setTranslate({ name: '', words: [] })
                          }}
                          data={translate.words}
                          ref={translateRef}
                          disabled={!(form.getValues('source') && form.getValues('target'))}
                          label={
                            !(form.getValues('source') && form.getValues('target')) ? 'Choose language source and target' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <span className="md:mt-8" onClick={() => remove(idx)}>
                    <TrashIcon />
                  </span>
                )}
              </div>
            )
          })}
          {!!(form.getValues('source') && form.getValues('target')) && (
            <CirclePlus className="mt-5 mx-auto" onClick={() => append({ term: '', definition: '' })} />
          )}
          <Button type="button" className="mt-5" onClick={form.handleSubmit(onSubmit)}>
            Create
          </Button>
        </form>
      </Form>
    </>
  )
}
