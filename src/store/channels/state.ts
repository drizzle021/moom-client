import { SerializedMessage, Channel, User } from 'src/contracts'


export interface ChannelsStateInterface {
  loading: boolean
  error: Error | null
  messages: { [channel: string]: SerializedMessage[] }
  active: string
  channels: Channel[]
  users: { [channel: string]: User[] }
  userStates:{[nickname: string]: string}
  page: number
  hasMorePages: boolean
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: '',
    channels: [],
    users: {},
    userStates: {},
    page: 1,
    hasMorePages: false
  }
}

export default state
