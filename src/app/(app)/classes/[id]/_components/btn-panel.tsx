'use client'

import { useState } from 'react'
import { FileCog, Share, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import z from 'zod'

import ShareBtn from '@/components/share-btn'
import { Button } from '@/components/ui/button'
import AlertDialogWrap from '@/components/alert-dialog-wrap'
import DialogWrap from '@/components/dialog-wrap'
import ClassForm from '../../_components/class-form'
import Spinner from '@/components/spinner'

import { classesAppPath, getClassAppPath } from '@/utils/paths'
import { deleteClassById } from '@/actions/class'
import { Err } from '@/types/errTypes'
import { useToast } from '@/hooks/use-toast'
import { SelectedSet } from '@/types/models/set'
import { SelectedUser } from '@/types/models/user'
import { SelectedClass } from '@/types/models/class'
import { classFormTypeSchema } from '@/types/forms/class'

export default function NavPanel({
  data,
  sets,
  users,
}: {
  data: Partial<SelectedClass>
  sets: SelectedSet[]
  users: SelectedUser[]
}) {
  const [isClosed, setClosed] = useState(false)
  const [isLoader, setLoader] = useState(false)

  const { push } = useRouter()
  const { toast } = useToast()
  const onDelete = async () => {
    const res: { success: boolean; error: null } | Err = await deleteClassById(data.id!)

    if (!res.error) {
      toast({ title: 'Class deleting', variant: 'success', description: 'Class was deleted successfully!' })

      setTimeout(() => push(classesAppPath), 500)
    }
  }

  const onSuccess = () => {
    setLoader(true)
    setClosed(true)

    setTimeout(() => {
      setLoader(false)
      setClosed(false)
    }, 500)
  }

  return (
    <div className="flex justify-center gap-3">
      <DialogWrap
        title={'Update Class'}
        trigger={
          <Button>
            <>
              <FileCog />
              Update
            </>
          </Button>
        }
        isAutoClose={isClosed}
        content={
          <ClassForm
            data={data as z.infer<typeof classFormTypeSchema>}
            action="update"
            sets={sets}
            users={users}
            onSuccess={onSuccess}
          />
        }
      />
      <ShareBtn
        trigger={
          <Button>
            <Share />
            Share
          </Button>
        }
        id={data.id!}
        url={getClassAppPath(data.id!)}
      />
      <AlertDialogWrap
        trigger={
          <Button variant="destructive" asChild>
            <span>
              <Trash2 />
              Remove
            </span>
          </Button>
        }
        action={onDelete}
        description="You are going to delete the Class..."
      />
      {isLoader && <Spinner />}
    </div>
  )
}
