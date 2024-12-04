import { User } from 'src/contracts'
import { authManager } from '.'
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





}

export default new ActivitySocketManager('/')
