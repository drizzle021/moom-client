import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels(context) {
    console.log(context.channels)
    // return Object.keys(context.messages)
    return context.channels
  },
  currentUsers (context){
    // console.log('users: ' + context.active !== null ? context.users[context.active!.name] : [])
    // console.log('users: ' )
    const anyad = "kk"
    return context.users[anyad]
    // return context.active !== null ? context.users[context.active.name] : []
  },
  currentMessages(context) {
    const anyad = "tytytyty"
    console.log(context.messages[anyad])
    return context.messages[anyad]
    // return context.active !== null ? context.messages[context.active.name] : []
  },
  lastMessageOf(context) {
    return (channel: string) => {
      const messages = context.messages[channel]
      return messages.length > 0 ? messages[messages.length - 1] : null
    }
  }
}

export default getters