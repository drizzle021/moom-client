import { User, Channel } from 'src/contracts'
import { authManager, channelService } from '.'
import { BootParams, SocketManager } from './SocketManager'
// import { api } from 'src/boot/axios'


class ActivitySocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      for (const user of onlineUsers) {
        store.commit('channels/SET_STATES', { user: user.name, userState: 'ONLINE' })
      }
    })

    this.socket.on('user:ONLINE', (user: User) => {
      store.commit('channels/SET_STATES', { user: user.name, userState: 'ONLINE' })
    })

    this.socket.on('user:OFFLINE', (user: User) => {
      store.commit('channels/SET_STATES', { user: user.name, userState: 'OFFLINE' })
    })

    this.socket.on('user:DND', (user: User) => {
      store.commit('channels/SET_STATES', { user: user.name, userState: 'DND' })
    })

    this.socket.on('userInvited', (user: User, channel: Channel) => {
      let check = false
      if (user.id === store.state.auth.user!.id 
   
      ){
        store.commit('channels/NEW_CHANNEL', channel)
        channelService.join(channel.name)
        return
      }
      if (store.state.channels.active !== ''){
        for (const u of store.state.channels!.users[channel.name]){
          if (u.nickname === user.nickname){
            check = true
          }
        }   
      }

      if (user.id !== store.state.auth.user!.id && channel.name in store.state.channels.users){
        store.commit('channels/USER_JOINED', { channel: channel.name, user })
      }


    })

    this.socket.on('userLeft', (user: User, channel: Channel) => {

      if (user.id !== store.state.auth.user!.id && channel.name in store.state.channels.users) {
        store.commit('channels/USER_LEFT', { channel: channel.name, user })
      }

      if (user.id === store.state.auth.user!.id) {
        channelService.leave(channel.name)
        store.commit('channels/CLEAR_CHANNEL', channel.name)
      }
    })
    
    

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }
  
  public changeState (userState: string): Promise<void> {
    return this.emitAsync('changeState', userState)
  }

  public inviteUser (channel: string, user: string): Promise<User> {
    return this.emitAsync('inviteUser', channel, user)
  }

   // VALAHOGY MASHOGY VAN ELKULDVE MINT AZ INVITE ES LEHET UGY KELLENE ENNEK IS MUKODNIE HOGY INSTANT KAPJON RESPONSEOT ES REFRESHELJEN
  public revokeUser (channel: string, user: string): Promise<void> {
    return this.emitAsync('revokeUser', channel, user)
  }

  public async kickUser (channel: string, user: string): Promise<void> {
    try {
      return this.emitAsync('kickUser', channel, user)
    } catch (error) {
      console.error('Error in kickUser:', error)
      throw error
    }
  }

}

export default new ActivitySocketManager('/')
