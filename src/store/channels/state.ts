import { SerializedMessage, Channel } from 'src/contracts'
import { SerializedUser } from 'src/contracts/User'

export interface ChannelsStateInterface {
  loading: boolean
  error: Error | null
  messages: { [channel: string]: SerializedMessage[] }
  active: Channel | null
  channels: Channel[]
  users: { [channel: string]: SerializedUser[] }
  // users: User[]
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: [],
    users: {}
  }
}

export default state
