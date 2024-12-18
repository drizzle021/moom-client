import { SerializedMessage, Channel, User, TypedMessage } from 'src/contracts'
import { MutationTree } from 'vuex'
import { ChannelsStateInterface } from './state'

const mutation: MutationTree<ChannelsStateInterface> = {
  LOADING_START(state) {
    state.loading = true
    state.error = null
  },
  LOADING_SUCCESS(state, { channel, messages }: { channel: string; messages: SerializedMessage[] }) {
    state.loading = false
    state.messages[channel] = messages
  },
  LOADING_ERROR(state, error) {
    state.loading = false
    state.error = error
  },
  CLEAR_CHANNEL(state, channel: string) {
    state.active = ''
    delete state.messages[channel]
    delete state.users[channel]

    const newChannels = [] as Channel[]
  
    for (const c of state.channels){
      if (c.name !== channel){
        newChannels.push(c)
      }
    }

    state.channels = newChannels
  },
  SET_ACTIVE(state, channel: string) {
    state.active = channel
  },
  NEW_MESSAGE(state, { channel, message }: { channel: string; message: SerializedMessage }) {
    state.messages[channel].push(message)
  },

  SET_CHANNELS(state, channels: Channel[]){
    state.channels = channels
  },  
  SET_CHANNEL_DATA (state, { channel, messages, users }: { channel: string, messages: SerializedMessage[], users: User[] }) {
    state.loading = false
    state.messages[channel] = messages
    state.users[channel] = users
    state.typedMessages[channel] = {}
  },
  NEW_CHANNEL(state, channel: Channel) {
    state.channels.unshift(channel)
  },

  USER_JOINED (state, { channel, user }: { channel: string, user: User }) {
    state.users[channel].push(user)
  },

  USER_LEFT (state, { channel, user }: { channel: string, user: User }) {
    console.log('1213')
    state.users[channel] = state.users[channel].filter(u => u.id !== user.id)
  },

  SET_STATES(state, { user, userState }: { user: string, userState: string }) {
    state.userStates[user] = userState
  },
  NEXT_PAGE(state){
    state.page += 1
  },
  RESET_PAGES(state){
    state.page = 2
  },
  LOAD_PAGE_MESSAGE(state, { channel, message }: { channel: string; message: SerializedMessage }) {
    state.messages[channel].unshift(message)
  },
  SET_HAS_MORE_PAGES(state, hasMorePages: boolean){
    state.hasMorePages = hasMorePages  
  },
  SET_TYPED_MESSAGE(state, { channel, message } : { channel: string, message: TypedMessage }){
    state.typedMessages[channel][message.author.nickname] = message
  }
  


}

export default mutation
