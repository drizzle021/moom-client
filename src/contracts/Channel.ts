import type { User } from 'src/contracts'

export interface Channel {
    name: string;
    icon: string;
    admin: User;
    is_private: boolean;
}