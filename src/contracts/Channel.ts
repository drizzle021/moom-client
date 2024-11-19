import type { User } from 'src/contracts'

export interface Channel {
    name: string;
    picture: string;
    admin: User;
    is_private: boolean;
}