import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { activityService, channelService } from 'src/services'
import { RawMessage, ChannelResponse } from 'src/contracts'
import { api } from 'boot/axios'
// import { AxiosResponse } from 'axios'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  
  async selectChannel ({ commit }, channel: string) {
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
      messages.reverse()

      commit('SET_CHANNEL_DATA', { channel, messages, users })

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

  async joinChannel({ commit, dispatch }, channel: string) {
    try {
      commit('LOADING_START')

      // const c = channelService.join(channel)

      const joinedChannel = await channelService.in(channel)?.joinChannel(channel)

      commit('NEW_CHANNEL', joinedChannel)

      await dispatch('selectChannel', joinedChannel!.name)
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

    if (this.state.channels.active == null){
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
      
      const response = await activityService.inviteUser(this.state.channels!.active!, channelOrUserName)

      // if (response) {
      //   if ('success' in response) {
      //     return { message: 'Successfully invited user ' + channelOrUserName }
      //   }
      // }

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

    }



    
    if (commandType === 'quit'){
      // const activeChannel = this.state.channels.active
      const isAdmin = (await api.get(`channels/${channelOrUserName}/admin`)).data
    
      console.log('admin: ' + isAdmin)
    
      await channelService.in(channelOrUserName)?.deleteChannel(channelOrUserName)

    }
  }

  // case 'quit': {
  //   const channelToDelete = await handleQuit(state, commandArguments)
  //   openConfirmDialog(
  //     `Are you sure you want to delete ${channelToDelete}?`,
  //     async () => {
  //       await channelService.in(channelToDelete)?.deleteChannel(channelToDelete)
  //     })
  //   break
  // }



  // NEVER USED
  // async addMember ({ commit }, {channel: string, user: string}) {
  //   const newMember = await activityService.inviteUser(channel, user)
  //   commit('NEW_MEMBER', { user: newMember })
  //   // channel: { name: string, is_private: boolean }, 
  //   try {
  //     // commit('LOADING_START')
  //     // const messages = await channelService.join(channel.name).loadMessages()
  //     // commit('LOADING_SUCCESS', { channel, messages })
  //     // commit('SET_ACTIVE', channel)
  //   } catch (err) {
  //     console.log('aaaaaaaaaaaaaa')
  //     commit('LOADING_ERROR', err)
  //     throw err
  //   }

  // }


}

export default actions