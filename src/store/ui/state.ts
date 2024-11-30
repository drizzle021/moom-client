import { User, Channel } from 'src/contracts/'

export interface ExampleStateInterface {
  membersDrawerState: boolean;
  channelsDrawerState: boolean;
  userProfileState: boolean;
  userProfileSelected: null| User;
  channelList: Channel[];
  memberList: User[];
  loggedInProfile: User;
  message: string;
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
    loggedInProfile: {  
      id: 1,
      name: 'firstname',
      surname: 'lastname',
      nickname: 'username',
      email: 'email@abc.com',
      status: 'hello!',
      icon: 'src/assets/kotori.jpg'
      // state: 'online'
    }
}
}

export default state
