import { SerializedMessage, Channel, User } from 'src/contracts'


export interface ChannelsStateInterface {
  loading: boolean
  error: Error | null
  messages: { [channel: string]: SerializedMessage[] }
  active: string
  channels: Channel[]
  users: { [channel: string]: User[] }
  userStates:{[nickname: string]: string}
  // users: User[]
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: '',
    channels: [],
    users: {},
    userStates: {}
  }
}

export default state
