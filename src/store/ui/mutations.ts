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
  toggleTypingDialog(state:ExampleStateInterface){
    state.typingDialogState = !state.typingDialogState
  },

  setMessage(state:ExampleStateInterface, message){
    state.message = message
  },

  switchUserProfile(state:ExampleStateInterface, user){
    state.userProfileSelected = user
  },
  // switchUserState(state:ExampleStateInterface, userState){
  //   state.loggedInProfile.state = userState
  // },

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
