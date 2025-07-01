import { User, AdapterUser } from 'next-auth'
import { SelectedUser } from './models/user'

declare module 'next-auth' {
  interface Session {
    user: { isCredentials: boolean } & SelectedUser & User & AdapterUser
    fileStorageAuth: string
  }
}
