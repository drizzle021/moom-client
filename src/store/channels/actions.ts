import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { channelService } from 'src/services'
import { RawMessage, User } from 'src/contracts'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join({ commit }, channel: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channel).loadMessages()
      commit('LOADING_SUCCESS', { channel, messages })
      commit('SET_ACTIVE', channel)
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async leave({ getters, commit }, channel: string | null) {
    const leaving: string[] =
      channel !== null ? [channel] : getters.joinedChannels

    leaving.forEach((c) => {
      channelService.leave(c)
      commit('CLEAR_CHANNEL', c)
    })
  },
  async addMessage(
    
    { commit },
    { channel, message }: { channel: string; message: RawMessage }
  ) {
    
    const newMessage = await channelService.in(channel)?.addMessage(message)
    
    commit('NEW_MESSAGE', { channel, message: newMessage })
  },

  async createChannelAction ({ commit }, channel: { name: string, admin: User, is_private: boolean }) {
    const newChannel = await channelService.addChannel(channel)

    commit('NEW_CHANNEL', { channel: newChannel })
  }
}

export default actions