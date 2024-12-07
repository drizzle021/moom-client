import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { activityService, channelService, authService } from 'src/services'
import { RawMessage, ChannelResponse, Channel } from 'src/contracts'
import { api } from 'boot/axios'
import auth from 'src/boot/auth'
// import { AxiosResponse } from 'axios'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  
  async selectChannel ({ commit, rootState, state }, channel: string) {
    // if (state.channels.length === 0) {
    //   commit('SET_SELECTED_CHANNEL', '')
    //   return
    // }
    if (!channel) {
      return
    }
    try {
      
      if (rootState.auth.userState !== 'OFFLINE'){
        const channelResponse: ChannelResponse = (await api.get(`/channels/${channel}`)).data
        const users = channelResponse.users

        const response = (await api.get(`/channels/${channel}/messages`)).data
        const messages = response.data


        // After getting the messages they come reversed order, so reverse them
        messages.reverse()
        commit('SET_CHANNEL_DATA', { channel, messages, users })


        commit('RESET_PAGES')
        const msgMeta = response.meta
        commit('SET_HAS_MORE_PAGES', msgMeta.next_page_url != null)

      }



      commit('SET_ACTIVE', channel)
      // console.log('active channel: ' + state.active)
    } catch (err) {
      commit('LOADING_ERROR', err)
      console.log(err)

    }
  },
  
  async getUserChannels ({ commit }): Promise<boolean> {
    try {
      const channels = await channelService.getChannel()
      

      commit('SET_CHANNELS', channels)

      for (const channel of channels) {
        const channelResponse: ChannelResponse = (await api.get(`/channels/${channel.name}`)).data
        const users = channelResponse.users

        const response = (await api.get(`/channels/${channel.name}/messages?page=1`)).data
        const messages = response.data


        // After getting the messages they come reversed order, so reverse them
        messages.reverse()
        commit('SET_CHANNEL_DATA', { channel: channel.name, messages, users })

        await channelService.join(channel.name)
      }


    } catch (error) {
      console.error(error)
      return false
    }
    return true
  },


  async revokeUser({ dispatch }, user: string){
    const response = await activityService.revokeUser(this.state.channels!.active!, user)
    // if (response) {
    //   if ('error' in response) {
    //     console.log(response)
    //   }
    //   if ('success' in response) {
    //     return { message: 'Successfully revoked user ' + user }
    //   }
    // }
    
    await dispatch('selectChannel', this.state.channels!.active)
  },

  async kickUser({ dispatch }, user: string){
    const response = await activityService.kickUser(this.state.channels!.active!, user)
    // if (response) {
    //   if ('error' in response) {
    //     console.log(response)
    //   }
    //   if ('success' in response) {
    //     console.log('success kick')
    //     return { message: 'Successfully kicked user ' + user }
    //   }
    // }
    await dispatch('selectChannel', this.state.channels!.active)
  },

  async createOrJoinChannel({ dispatch }, channel: { name: string, is_private: boolean }) {
    const response = (await api.get(`/channels/${channel.name}/check`)).data

      if (response){
        // maybe useless
        if ('error' in response) {
          console.log(response)
        }

        if ('success' in response){
          const createNew = !response.channel

          if (createNew){
            await dispatch('createChannel', channel)
          }
          else {
            await dispatch('joinChannel', channel.name)
          }

        }
    }
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

  async joinChannel({ commit, dispatch }, channel: string) {
    try {
      commit('LOADING_START')

      channelService.join(channel)
      
      const joinedChannel = await channelService.in(channel)?.joinChannel(channel)

      commit('NEW_CHANNEL', joinedChannel)

      await dispatch('selectChannel', joinedChannel!.name)
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },


  async deleteChannel({ commit, dispatch }, channel: string) {
    try {
      commit('LOADING_START')
      const isAdmin = (await api.get(`channels/${channel}/admin`)).data


      if (isAdmin){
        await channelService.in(channel)?.deleteChannel(channel)
        const channels = await channelService.getChannel()
        commit('SET_CHANNELS', channels)
        if (this.state.channels.active === channel) {
          commit('SET_ACTIVE', '')

        }

      }
      if (!isAdmin){
        await channelService.in(channel)?.leaveChannel(channel)
        const channels = await channelService.getChannel()
        commit('SET_CHANNELS', channels)
        if (this.state.channels.active === channel) {
          commit('SET_ACTIVE', '')
        }

      }


     
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

  async leaveChannel({ state }, channel: string){
    channelService.leave(channel)
  },

  async addMessage({ commit, dispatch }, { channel, message }: { channel: string; message: RawMessage }) {
    const commandsTypes = ['join', 'invite', 'revoke', 'kick', 'cancel', 'quit', 'list']
    let isCommand = false

    commandsTypes.forEach(element => {
      if (message.trim().startsWith('/' + element)){
        isCommand = true
      }
      
    })

    if (isCommand){
      return await dispatch('handleCommand', message)
    }

    if (this.state.channels.active === ''){
      return
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
  
    // /join channelName private
    if (commandType === 'join'){  

      const response = (await api.get(`/channels/${channelOrUserName}/check`)).data

      

      // create new channel
      if (response){

        if ('success' in response){

          const createNew = !response.channel

          const channel = createNew ? { name: channelOrUserName, is_private: publicityOfChannel === 'private' } : response.channel

          if (createNew){
            await dispatch('createChannel', channel)
          }
          else {
            await dispatch('joinChannel', channel.name)
          }

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
      await dispatch('inviteMember', channelOrUserName)

    }

    // /revoke nickName
    if (commandType === 'revoke'){  
      await dispatch('revokeUser', channelOrUserName)
    }

    // /kick nickName
    if (commandType === 'kick'){  
      await dispatch('kickUser', channelOrUserName)
    }


    if (commandType === 'list'){
      commit('ui/toggleMembersDrawer', true, { root: true })
    }


    if (commandType === 'cancel'){
      const isAdmin = (await api.get(`channels/${channelOrUserName}/admin`)).data

      // ADMIN DELETES THE CHANNEL WITH CANCEL
      if (isAdmin){
        await channelService.in(channelOrUserName)?.deleteChannel(channelOrUserName)
      }
      // MEMBER JUST LEAVES CHANNEL WITH CANCEL
      if (!isAdmin){
        await channelService.in(channelOrUserName)?.leaveChannel(channelOrUserName)
      }

      const channels = await channelService.getChannel()
      commit('SET_CHANNELS', channels)
      commit('SET_ACTIVE', '')

    }



    
    if (commandType === 'quit'){
      // const activeChannel = this.state.channels.active
      const isAdmin = (await api.get(`channels/${channelOrUserName}/admin`)).data
    
      console.log('admin: ' + isAdmin)
    
      await channelService.in(channelOrUserName)?.deleteChannel(channelOrUserName)

      const channels = await channelService.getChannel()
      commit('SET_CHANNELS', channels)
      commit('SET_ACTIVE', '')

    }
  },


  async inviteMember ({ dispatch }, user) {
    const response = await activityService.inviteUser(this.state.channels!.active!, user)
    await dispatch('selectChannel', this.state.channels!.active)
  },

  async removeSocket ({ getters, commit }, { channel, clearChannelData = true }: {channel: string, clearChannelData?: boolean}) {
    const leaving: Channel[] = channel !== '' ? [channel] : getters.joinedChannels
    for (const c of leaving) {
      channelService.leave(c.name)
      if (clearChannelData) {
        commit('CLEAR_CHANNEL', c.name)
      }
    }
  },

  async loadPage({ state, commit }){
    const response = await api.get(`channels/${state.active}/messages?` + `page=${state.page}`)

    const messages = response.data.data

    for (const m of messages){
      commit('LOAD_PAGE_MESSAGE', { channel: state.active, message: m })
    }

    commit('NEXT_PAGE')
    const msgMeta = response.data.meta
    commit('SET_HAS_MORE_PAGES', msgMeta.next_page_url != null)

  },

  async userTyping({ state }, message){
    await channelService.in(state.active)?.currentlyTyping(message)
  }


}

export default actions