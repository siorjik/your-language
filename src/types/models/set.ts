import { Set, User } from '@prisma/client'

export type SetListItem = { term: string; definition: string }

export type SetList = SetListItem[]

export type SelectedSet = Set & { user: Pick<User, 'name' | 'image'>; owner: Pick<User, 'name' | 'image'> | null }
