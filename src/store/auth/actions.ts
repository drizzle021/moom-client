import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'
import { authService, authManager, activityService, channelService } from 'src/services'
import { LoginCredentials, RegisterData, ChannelResponse } from 'src/contracts'
import { api } from 'boot/axios'

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check ({ commit }) {
    try {
      commit('AUTH_START')
      const user = await authService.me()
      // join user to general channel - hardcoded for now
      // if (user?.id !== state.user?.id) {
      //   await dispatch('channels/join', 'general', { root: true })
      // }

      commit('AUTH_SUCCESS', user)
      return user !== null
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },


  async setStatus ({ commit, dispatch, state, rootState }, userState) {

    if (state.userState === userState) {
      return
    }

    await activityService.changeState(userState)
    commit('SET_USER_STATE', userState)
    
    if (userState === 'OFFLINE') {
      await dispatch('channels/removeSocket', { channel: '', clearChannelData: false }, { root: true })
    } 
    else if (userState === 'ONLINE' || userState === 'DND') {

      const channels = await channelService.getChannel()
      

      commit('channels/SET_CHANNELS', channels, { root: true })

      for (const channel of channels) {
        await channelService.join(channel.name)
      }

/*       if (rootState.channels.active === ''){
        return
      } */
    }
  },  


  async register ({ commit }, form: RegisterData) {
    try {
      commit('AUTH_START')
      const user = await authService.register(form)
      commit('AUTH_SUCCESS', null)
      return user
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async login ({ commit }, credentials: LoginCredentials) {
    try {
      commit('AUTH_START')
      const apiToken = await authService.login(credentials)
      commit('AUTH_SUCCESS', null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async logout ({ commit, dispatch }) {
    try {
      commit('AUTH_START')
      await authService.logout()
      await dispatch('channels/leave', null, { root: true })
      commit('AUTH_SUCCESS', null)

      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  }
}

export default actions