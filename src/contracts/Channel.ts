import { SerializedMessage } from 'src/contracts/Message'
import { SerializedUser } from 'src/contracts/User'

export interface Channel {
    name: string;
    picture: string;
    admin_id: number;
    is_private: boolean;
}

export interface ChannelResponse extends Channel {
    messages: SerializedMessage[],
    users: SerializedUser[]
  }
  