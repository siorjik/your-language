import { User, AdapterUser } from 'next-auth'
import { SelectedUser } from './models/user'

declare module 'next-auth' {
  interface Session {
    user: SelectedUser & User & AdapterUser
  }
}
