import { User } from 'src/contracts'
import { authManager } from '.'
import { SocketManager } from './SocketManager'
// import { api } from 'src/boot/axios'


class ActivitySocketManager extends SocketManager {
  public subscribe (): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers)
    })

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }
  
  public changeStatus (status: string): Promise<void> {
    return this.emitAsync('changeStatus', status)
  }

  // VALOSZINULEG KELL IDE CHANNEL IS NEM CSAK USER STRING
  public inviteUser (user: string): Promise<void> {
    // channel: { name: string, is_private: boolean }, 
    return this.emitAsync('inviteUser', user)
  }



}

export default new ActivitySocketManager('/')
