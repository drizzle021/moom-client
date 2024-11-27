import { SerializedMessage, Channel, User } from 'src/contracts'
import { MutationTree } from 'vuex'
import { ChannelsStateInterface } from './state'
import { SerializedUser } from 'src/contracts/User'

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START(state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS(state, { channel, messages }: { channel: Channel; messages: SerializedMessage[] }) {
    state.loading = false
    state.messages[channel.name] = messages
  },
  LOADING_ERROR(state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL(state, channel) {
    state.active = null
    delete state.messages[channel]
  },
  SET_ACTIVE(state, channel: Channel) {
    state.active = channel
  },
  NEW_MESSAGE(state, { channel, message }: 
    { channel: string; message: SerializedMessage }
  ) {
    state.messages[channel].push(message)
  },




  SET_CHANNELS(state, channels: Channel[]){
    state.channels = channels
  },  
  SET_CHANNEL_DATA (state, { channel, messages, users }: { channel: string, messages: SerializedMessage[], users: SerializedUser[] }) {
    state.loading = false
    state.messages[channel] = messages
    state.users[channel] = users
    // state.currentlyTypedMessages[channel] = {}
  },
  NEW_CHANNEL(state, { channel }) {
    state.channels.unshift(channel)
    console.log(state.channels)
  },

  USER_JOINED (state, { channel, user }: { channel: string, user: SerializedUser }) {
    state.users[channel].push(user)
  }

}

export default mutation
