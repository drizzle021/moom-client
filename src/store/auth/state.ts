import { User } from 'src/contracts'

export interface AuthStateInterface {
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string }[],
  userState: 'ONLINE' | 'OFFLINE' | 'DND'
}

function state (): AuthStateInterface {
  return {
    user: null,
    status: 'pending',
    errors: [],
    userState: 'ONLINE'
  }
}

export default state