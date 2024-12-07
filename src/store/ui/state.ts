import { User, Channel } from 'src/contracts/'

export interface ExampleStateInterface {
  membersDrawerState: boolean;
  channelsDrawerState: boolean;
  userProfileState: boolean;
  userProfileSelected: null| User;
  channelList: Channel[];
  memberList: User[];
  message: string;
  typingDialogState: boolean;
  usersTyping: boolean;
}

function state(): ExampleStateInterface {
  return {
    membersDrawerState: true,
    channelsDrawerState: true,
    message: '',
    userProfileState: false,
    userProfileSelected: null,
    channelList: [],
    memberList: [],
    typingDialogState: false,
    usersTyping: false

}
}

export default state
