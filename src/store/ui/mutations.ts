import { MutationTree } from 'vuex'
import { ExampleStateInterface } from './state'

const mutation: MutationTree<ExampleStateInterface> = {
  toggleMembersDrawer(state:ExampleStateInterface){
    state.membersDrawerState = !state.membersDrawerState
  },

  toggleChannelsDrawer(state:ExampleStateInterface){
    state.channelsDrawerState = !state.channelsDrawerState
  },
  toggleUserProfile(state:ExampleStateInterface){
    state.userProfileState = !state.userProfileState
  },
  
  switchChannel(state:ExampleStateInterface, channel){
    state.selectedChannel = channel
  },
  switchUserProfile(state:ExampleStateInterface, user){
    state.userProfileSelected = user
  },
  switchUserState(state:ExampleStateInterface, userState){
    state.loggedInProfile.state = userState
  },

  addChannel(state:ExampleStateInterface, channel){
    state.channelList.unshift({
      name: channel.name,
      icon: channel.icon,
      is_private: channel.is_private 
      // link: ''
      }
    )

  },
  deleteChannel(state:ExampleStateInterface, channel){
    if (channel !== null){
      const channelIndex = state.channelList.findIndex(ch => ch.name === channel)
      if (channelIndex !== -1) {
        state.channelList.splice(channelIndex, 1) // Remove channel from list
        if (channel === state.selectedChannel!.name){
          state.selectedChannel = state.channelList[0]
        }
        
      }

    }

  },

  addMember(state:ExampleStateInterface, user){
    state.memberList.push(user)
  },
  kickMember(state:ExampleStateInterface, user){
    const memberIndex = state.memberList.findIndex(m => m.name === user.name)
    if (memberIndex !== -1) {
      state.memberList.splice(memberIndex, 1) // Remove member from list
    }
  }


}

export default mutation
