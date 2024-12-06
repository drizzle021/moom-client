import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels(context) {
    return context.channels
  },
  currentUsers (context){
    return context.active !== null ? context.users[context.active] : []
  },
  currentMessages(context) {
    return context.active !== null ? context.messages[context.active] : []
  }
}

export default getters