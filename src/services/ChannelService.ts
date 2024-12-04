import { RawMessage, SerializedMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import type { Channel, User } from 'src/contracts'
import { api } from 'src/boot/axios'
import { AxiosResponse } from 'axios'

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channel, message })
    })

    
    this.socket.on('userJoined', (user: User) => {
      if (user.id !== store.state.auth.user!.id) {
        store.commit('channels/USER_JOINED', { channel, user })
      }
    })
  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages')
  }

  public addChannel (channel: Channel): Promise<Channel>{
    return this.emitAsync('addChannel', channel)
  }

  public joinChannel (channel: string): Promise<Channel> {
    return this.emitAsync('addUser', channel)
  }

  public deleteChannel (channel: string): Promise<void> {
    return this.emitAsync('deleteChannel', channel)
  }

  public leaveChannel (channel: string): Promise<void> {
    return this.emitAsync('leaveChannel', channel)
  }

  public async inviteUser (channel: string, user: string): Promise<User> {
    return await this.emitAsync('inviteUser', channel, user)
  }

  public revokeUser (channel: string, user: string): Promise<void> {
    return this.emitAsync('revokeUser', channel, user)
  }

  public async kickUser (channel: string, user: string, isRevoke: boolean): Promise<any> {
    
    try {
      console.log('trying to kick user: ' + user + ' from channel: ' + channel)
      return await this.emitAsync('kickUser', channel, user)
    } catch (error) {
      console.error('Error in kickUser:', error)
      throw error // Re-throw if you want the caller to handle it
    }
    // return this.emitAsync('kickUser', channel, user, isRevoke)
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
       throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace

    const channel = new ChannelSocketManager(`/channels/${name}`)

    this.channels.set(name, channel)
    return channel
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    console.log(channel)
    if (!channel) {
      return false
    }

    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }

  async addChannel(channel: { name: string, is_private: boolean }): Promise<Channel> {
    const response = await api.post<Channel>('channels/addChannel', channel)
    return response.data
  }

  async addMember(user: string): Promise<User> {
    const response = await api.post<User>('channels/addMember', user)
    return response.data
  }

  async getChannel(){
    const response: AxiosResponse<Channel[]> = await api.get('/channels')
    return response.data
  }

}

export default new ChannelService()
