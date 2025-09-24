import { Class, User } from '@prisma/client'

export type SelectedClass = Class & { creator: Pick<User, 'name' | 'image' | 'id'>; sets: string[]; users: string[] }
