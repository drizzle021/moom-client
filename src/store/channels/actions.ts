import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { activityService, channelService } from 'src/services'
import { RawMessage, ChannelResponse } from 'src/contracts'
import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'

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

      // console.log(users[7].icon)

      const messages = (await api.get(`/channels/${channel}/messages`)).data.data


      // After getting the messages they come reversed order, so reverse them
      const m = messages.reverse()

      commit('SET_CHANNEL_DATA', { channel: channel, messages, users })

      commit('SET_ACTIVE', channel)
      // console.log('active channel: ' + state.active)
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

  async createChannel ({ commit, dispatch }, channel: { name: string, is_private: boolean }) {
    try {
      
      commit('LOADING_START')
      const newChannel = await channelService.addChannel(channel)
      commit('NEW_CHANNEL', newChannel)

      const messages = await channelService.join(channel.name).loadMessages()
      const name = channel.name
      commit('LOADING_SUCCESS', { name, messages })
      // commit('SET_ACTIVE', channel.name)
      await dispatch('selectChannel', channel.name)
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }

    
  },

  async joinChannel({ commit }, channel: string) {
    try {
      commit('LOADING_START')
      const users = await channelService.join(channel)

      // ez amugy nem loadol messageket hanem usereket ad vissza
      const messages = await channelService.join(channel).loadMessages()
      console.log('nem jut ide ')
      console.log(messages)
      const joinedChannel = await channelService.in(channel)?.joinChannel(channel)
      console.log('ide se')
      commit('NEW_CHANNEL', joinedChannel)
      commit('LOADING_SUCCESS', { channel, messages })
      commit('SET_ACTIVE', channel)
    } catch (err) {
      console.log('fasszomerror')
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

  async addMessage({ commit, dispatch }, { channel, message }: { channel: string; message: RawMessage }) {

    const command = message.startsWith('/')

    if (command){
      return dispatch('handleCommand', message)
    }

    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  },

  async handleCommand({ commit, dispatch }, message: string){
    message = message.replace(/\s{2,}/g, ' ').trim()
    const wholeCommand = message.substring(1)
    const parts = wholeCommand.split(' ')
    const commandType = parts[0]
    const channelOrUserName = parts[1]
    const publicityOfChannel = parts[2]
  
    console.log('command type: ' + commandType)
    console.log('command variable: ' + channelOrUserName)
    console.log('publicity: ' + publicityOfChannel)

    // /join channelName private
    if (commandType === 'join'){  
      console.log(this.state.channels.users)
      console.log('join channel')
      const response = (await api.get(`/channels/${channelOrUserName}/check`)).data
      console.log(response)
      console.log('sent api')
      // create new channel
      if (response){
        console.log('got response')
        if ('success' in response){
          console.log('success received')
          const createNew = !response.channel

          const channel = createNew ? { name: channelOrUserName, public: publicityOfChannel === 'public' } : response.channel
          const action = createNew ? 'createChannel' : 'joinChannel'
          await dispatch(action, channel.name)

        }

      }



      // if (response) {
      //   if ('error' in response) {
      //     throw new ValidationException(response.error)
      //   }
      //   if ('success' in response) {
      //     if (response.channel) {
      //       return {
      //         message: 'Successfully joined channel ' + channelName,
      //         channel: response.channel,
      //         newChannel: false
      //       }
      //     }
      //     return {
      //       message: 'Successfully created channel ' + channelName,
      //       channel: {
      //         name: channelName,
      //         public: publicity === 'public'
      //       },
      //       newChannel: true
      //     }
      //   }
      // }
    }

    // /invite nickName
    if (commandType === 'invite'){  
      console.log('invite member')
    }

    // /revoke nickName
    if (commandType === 'revoke'){  
      console.log('revoke member')
    }

    // /kick nickName
    if (commandType === 'kick'){  
      console.log('kick member')
    }
    if (commandType === 'list'){
      console.log('list members')
      commit('ui/toggleMembersDrawer', true, { root: true })
    }
    if (commandType === 'cancel'){
      console.log('cancel channel')
    }
    if (commandType === 'quit'){
      console.log('quit channel')
    }
  },





  async addMember ({ commit }, user: string) {
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