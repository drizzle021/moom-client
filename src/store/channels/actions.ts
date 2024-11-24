import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { activityService, channelService } from 'src/services'
import { RawMessage } from 'src/contracts'
// import { api } from 'src/boot/axios'


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
  async addMessage({ commit },
    { channel, message }: { channel: string; message: RawMessage }
  ) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  },

  async createChannelAction ({ commit }, channel: { name: string, is_private: boolean }) {
    const newChannel = await channelService.addChannel(channel)
    commit('NEW_CHANNEL', { channel: newChannel })

    try {
      commit('LOADING_START')
      const messages = await channelService.join(channel.name).loadMessages()
      commit('LOADING_SUCCESS', { channel, messages })
      commit('SET_ACTIVE', channel)
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }

  },

  async addMemberAction ({ commit }, user: string) {
    const newMember = await activityService.inviteUser(user)
    commit('NEW_MEMBER', { user: newMember })
    // channel: { name: string, is_private: boolean }, 
    try {
      // commit('LOADING_START')
      // const messages = await channelService.join(channel.name).loadMessages()
      // commit('LOADING_SUCCESS', { channel, messages })
      // commit('SET_ACTIVE', channel)
    } catch (err) {
      console.log('aaaaaaaaaaaaaa')
      commit('LOADING_ERROR', err)
      throw err
    }

  }



  // async getChannels({getters, commit}) {
  //   const joinedChannels = getters.joinedChannels
  
  //   for (const channel of joinedChannels){
  //     const data = await 
  //     commit('SET_CHANNEL', {channel, data})
  //   }
  // }

}

export default actions