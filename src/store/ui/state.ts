import { User, Channel } from 'src/contracts/'

export interface ExampleStateInterface {
  membersDrawerState: boolean;
  channelsDrawerState: boolean;
  selectedChannel: null | Channel;
  userProfileState: boolean;
  userProfileSelected: null| User;
  channelList: Channel[];
  memberList: User[];
  loggedInProfile: User;
}

function state(): ExampleStateInterface {
  return {
    membersDrawerState: true,
    channelsDrawerState: true,
    selectedChannel: {
      name: 'lol',
      icon: 'src/assets/chitoge.jpg',
      is_private: false
    },
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
