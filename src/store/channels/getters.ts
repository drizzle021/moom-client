import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { TypedMessage } from 'src/contracts'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels(context) {
    return context.channels
  },
  currentUsers (context){
    return context.active !== null ? context.users[context.active] : []
  },
  currentMessages(context) {
    return context.active !== null ? context.messages[context.active] : []
  },
  
  currentlyTypedMessages(context) {
    const currentChannelMessages = context.typedMessages[context.active]

    const messages = [] as TypedMessage[]

    for (const m in currentChannelMessages){
      if (currentChannelMessages[m].content.length > 0){
        messages.push(currentChannelMessages[m])
      }
      
    }

    return messages

  },

  currentTypers(context) {
    const currentChannelMessages = context.typedMessages[context.active]

    const typers = [] as string[]

    for (const m in currentChannelMessages){
      if (currentChannelMessages[m].content.length > 0){
        typers.push(m)
      }
      
    }

    return typers.join(', ')

  }
  
  
  
}

export default getters