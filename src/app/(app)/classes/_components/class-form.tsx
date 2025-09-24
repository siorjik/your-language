'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/multi-select'

import { classFormTypeSchema } from '@/types/forms/class'
import { useEffect } from 'react'
import { SelectedSet } from '@/types/models/set'
import ImageUploading from '@/components/image-uploading'
import { createClass, updateClass } from '@/actions/class'
import { deleteFile, uploadFile } from '@/actions/fileStorage'
import { Err } from '@/types/errTypes'
import { SelectedUser } from '@/types/models/user'
import { Class } from '@prisma/client'
import { createNotification } from '@/actions/notification'
import { NOTIFICATION_TYPES, SOCKET_EVENTS } from '@/utils/constants'
import useSocket from '@/hooks/useSocket'

type ClassFormProps = {
  data?: z.infer<typeof classFormTypeSchema> | null
  action: 'create' | 'update' | null
  sets: SelectedSet[]
  users?: SelectedUser[]
  onSuccess?: () => void
}

const defaultValues = { title: '', sets: [], users: [], image: '', file: undefined }

export default function ClassForm({ data = null, action = null, sets, users, onSuccess }: ClassFormProps) {
  useEffect(() => {
    form.setFocus('title')
  }, [])

  const form = useForm<z.infer<typeof classFormTypeSchema>>({
    resolver: zodResolver(classFormTypeSchema),
    defaultValues: data || defaultValues,
  })

  const { eventEmit } = useSocket(SOCKET_EVENTS.notification)

  const isCreate = action === 'create'

  const onSubmit = async (values: z.infer<typeof classFormTypeSchema>): Promise<void> => {
    let image = undefined

    try {
      if (values.file) {
        if (values.image) await deleteFile(values.image)

        const res: { url: string; error: null } | Err = await uploadFile(values.file)

        if (!res.error) image = res.url
      }

      delete values.file

      if (isCreate) {
        const res: (Class & { error: null }) | Err = await createClass({ ...values, image })

        if (!res.error) {
          await createNotification({ classId: res.id, type: NOTIFICATION_TYPES.createdClass })

          eventEmit()
        } else throw res.error
      } else await updateClass({ ...values, image: image || values.image })

      onSuccess?.()
    } catch (error) {
      console.log(error)
    }
  }

  const onSelect = (val: { label: string; value: string }[]) => {
    form.setValue(
      'sets',
      val.map((el) => el.value),
    )
  }

  const setOptions = sets.map((set) => ({ label: set.title, value: set.id }))
  const setValues = sets
    .filter((set) => form.getValues('sets').find((el) => el === set.id))
    .map((set) => ({ value: set.id, label: set.title }))

  const userOptions = users?.map((user) => ({ label: user.name, value: user.id }))
  const userValues = users
    ?.filter((user) => form.getValues('users')?.find((el) => el === user.id))
    .map((user) => ({ value: user.id, label: user.name }))

  return (
    <>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-5">
            <FormField
              control={form.control}
              name="sets"
              render={() => (
                <FormItem>
                  <FormLabel>Sets*</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      className="overflow-x-auto"
                      value={setValues}
                      placeholder="Choose Sets"
                      options={setOptions}
                      onChange={onSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isCreate && !!users?.length && (
            <div className="mt-5">
              <FormField
                control={form.control}
                name="users"
                render={() => (
                  <FormItem>
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        className="overflow-x-auto"
                        value={userValues}
                        placeholder="Choose Users"
                        options={userOptions}
                        onChange={onSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="w-fit mx-auto mt-10">
            <ImageUploading
              imageUrl={form.getValues('image')}
              placeholder={<ImageIcon size={150} />}
              getImage={(file) => form.setValue('file', file)}
            />
          </div>
          <Button type="button" className="dialog-submit-btn" onClick={form.handleSubmit(onSubmit)}>
            {action === 'create' ? 'Create' : 'Update'}
          </Button>
        </form>
      </Form>
    </>
  )
}
