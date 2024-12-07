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
  SET_NOTIFS(state:ExampleStateInterface, newState){
    console.log(newState)
    state.notifPref = newState
  },
  SET_TYPING(state:ExampleStateInterface, isTyping){
    state.usersTyping = isTyping
  },

  switchUserProfile(state:ExampleStateInterface, user){
    state.userProfileSelected = user
  }

}

export default mutation
