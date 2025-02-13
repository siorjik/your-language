import { User } from '@prisma/client'

export type SelectedUser = Omit<User, 'password'>
