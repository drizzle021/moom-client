<template>
  <q-layout view="hHh LpR lfr">
    <NavBar :activeChannel="activeChannel ? activeChannel : ''" />

    <ChannelsDrawer />

    <MembersDrawer />

    <UserProfile />

    <q-page-container>
      <router-view />
    </q-page-container>


    <TypingDialog/>

    <q-footer class="bg-white text-white fixed-footer">
      <q-toolbar>
        <q-input :disable="loading || userState" @keydown.enter.prevent="send" outlined bottom-slots v-model="message"
          label="Type your message..." counter maxlength="2000" rounded autogrow class="full-width q-py-lg">
          <template v-slot:append>
            <q-btn icon="help" flat ripple>
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-body1"
                style="overflow: visible;">
                <div class="tooltip-content">
                  <span>/join<br>/invite<br>/revoke<br>/kick<br>/list<br>/cancel<br>/quit</span>
                  <div class="image-wrapper">
                  </div>
                </div>
              </q-tooltip>
            </q-btn>
          </template>
          <template v-slot:after>
            <q-btn :disable="loading" @click="send" type="submit" round dense flat icon="send" />
          </template>
          <template v-slot:hint v-if="isTyping" >
            <div @click="openTyping">
              {{ typers }} currently typing...

            </div>
            
          </template>
        </q-input>
      </q-toolbar>
    </q-footer>


  </q-layout>


</template>

<script lang="ts">

import { mapActions, mapGetters, mapMutations } from 'vuex'
import NavBar from 'src/components/NavBar.vue'
import MembersDrawer from 'src/components/Members/MembersDrawer.vue'
import ChannelsDrawer from 'src/components/Channels/ChannelsDrawer.vue'
import UserProfile from 'src/components/UserProfile.vue'
import TypingDialog from 'src/components/TypingDialog.vue'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'



export default defineComponent({
  name: 'MainLayout',

  components: {
    NavBar,
    MembersDrawer,
    ChannelsDrawer,
    TypingDialog,
    UserProfile
  },



  data() {
    return {
      message: '',
      selectedUser: {},
      profile: false,

      loading: false as boolean,

      typingTimeout: null as number | null
    }
  },

  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      typers: 'currentTypers'
    }),

    activeChannel() {
      return this.$store.state.channels.active
    },
    userState() {
      return this.$store.state.auth.userState === 'OFFLINE'
    },
    typingDialog() {
      return this.$store.state.ui.typingDialogState
    },
    isTyping() {
      return this.$store.state.ui.usersTyping
    }

  },

  mounted() {
    this.getChannels()
  },

  methods: {
    async getChannels(){

      const success = await this.$store.dispatch('channels/getUserChannels', useRoute().params.name)
      if (!success) {
        await useRouter().push({ path: '/404' })
      }
    },

    async send() {
      if (this.message.trim() !== ''){
        this.loading = true
        await this.addMessage({ channel: this.activeChannel, message: this.message })
        this.message = ''
        this.loading = false
      }
    },
    openTyping(){
      this.$store.commit('ui/toggleTypingDialog')
    },


    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('channels', ['addMessage', 'userTyping']),
  



  async handleTyping() {
    if (this.typingTimeout !== null) {
      clearTimeout(this.typingTimeout)
    }

    this.$store.commit('ui/SET_TYPING', true)

    this.userTyping(this.message)

    // Set a delay to hide "is typing" message after user stops typing
    this.typingTimeout = window.setTimeout(() => {
      this.$store.commit('ui/SET_TYPING', false)
    }, 2000) // 1 second delay after user stops typing
  }
},





  watch: {
    message() {
      this.handleTyping()
      if (this.message.trim() === ''){
        this.$store.commit('ui/SET_TYPING', false)
      }
      
    },
    activeChannel(){
      this.message = ''
    }
  }



})

</script>


<style lang="scss">
.hovered:not(.mentioned):hover {
  background-color: $grey-3
}

.mentioned {
  background-color: $yellow-3
}

.mentioned:hover {
  background-color: $yellow-4
}

.tooltip-content {
  display: flex;
  align-items: center;

}

.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
}

.image-wrapper {
  position: relative;
  width: 40px;
  height: 0;
}

.tooltip-image {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -200px;
  width: 300px;
  height: auto;
}
</style>