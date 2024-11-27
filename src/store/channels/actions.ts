import { ActionTree } from 'vuex'
import { AxiosResponse } from 'axios'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { activityService, channelService } from 'src/services'
import { RawMessage, ChannelResponse } from 'src/contracts'
import { api } from 'boot/axios'


const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  
  async selectChannel ({ state, commit, getters, dispatch }, channel: string) {
    // if (state.channels.length === 0) {
    //   commit('SET_SELECTED_CHANNEL', '')
    //   return
    // }
    if (!channel) {
      return
    }

    try {

      const channelResponse: ChannelResponse = (await api.get(`/channels/${channel}`)).data
      const users = channelResponse.users

      const channelResponseMessages: ChannelResponse = (await api.get(`/channels/${channel}/messages`)).data
      const messages = channelResponseMessages
      commit('SET_CHANNEL_DATA', { channel: channel, messages, users })

      commit('SET_ACTIVE', channel)
      console.log('active channel: ' + state.active)
    } catch (err) {
      commit('LOADING_ERROR', err)
      console.log(err)

    }
  },
  
  async getUserChannels ({ commit, dispatch }, channelFromRoute: string): Promise<boolean> {
    try {
      const channels = await channelService.getChannel()
      

      commit('SET_CHANNELS', channels)

      for (const channel of channels) {
        commit('SET_CHANNEL_DATA', { channel: channel.name, messages: [], users: [] })
        await channelService.join(channel.name)
      }


    } catch (error) {
      console.error(error)
      return false
    }
    return true
  },
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


}

export default actions