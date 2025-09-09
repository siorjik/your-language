import { Set, User } from '@prisma/client'

export type SetListItem = { term: string; definition: string }

export type SetList = SetListItem[]

export type SelectedSet = Omit<Set, 'list'> & {
  user?: Pick<User, 'name' | 'image' | 'id'>
  creator?: Pick<User, 'name' | 'image' | 'id'> | null
  list: SetList
}

export type SetCreatorInfo = { img: string | null; createdBy: string; createdAt: Date; id: string }

export type SetCreator = { creator: { name: string; id: string } }
