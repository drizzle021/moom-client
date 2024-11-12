import { SerializedMessage, Channel } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean
  error: Error | null
  messages: { [channel: string]: SerializedMessage[] }
  active: string | null
  channels: Channel[]
}

function state(): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    active: null,
    channels: []
  }
}

export default state
