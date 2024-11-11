<template>
  <q-layout view="hHh LpR lfr">
    <NavBar />

    <ChannelsDrawer />

    <MembersDrawer />

    <UserProfile />

    <!-- Make into components -->

    <q-page class="column justify-end" ref="messagesContainer">
      <q-infinite-scroll reverse @load="onLoad" :offset="100">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" size="40px" />
          </div>
        </template>
        <MessageComponent v-for="message in messages" :key="message.text" :message="message" />
      </q-infinite-scroll>
    </q-page>

    <q-footer class="bg-white text-white fixed-footer">
      <q-toolbar>
        <q-form @submit.prevent="sendMessage" class="full-width">
          <q-input @keydown.enter.prevent="sendMessage" outlined bottom-slots v-model="text"
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
              <q-btn @click="sendMessage" type="submit" round dense flat icon="send" />
            </template>
            <template v-slot:hint v-if="isTyping">
              {{ "user is typing..." }}
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>


  </q-layout>


</template>

<script lang="ts">
import NavBar from 'src/components/NavBar.vue'
import MembersDrawer from 'src/components/Members/MembersDrawer.vue'
import ChannelsDrawer from 'src/components/Channels/ChannelsDrawer.vue'
import UserProfile from 'src/components/UserProfile.vue'
import { nextTick, defineComponent, ref } from 'vue'





export default defineComponent({
  name: 'ChannelPage',

  components: {
    NavBar,
    MembersDrawer,

    ChannelsDrawer,
    UserProfile
  },

  data() {
    return {
      text: '',
      selectedUser: {},
      profile: false,

      isTyping: false,
      typingTimeout: null as number | null,
      page: 1,
      messages: [
        {
          id: 1,
          text: 'lorem ipsum',
          from: 'User 1'
        },
        {
          id: 2,
          text: 'lorem ipsum',
          from: 'User 2'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 1'
        },
        {
          id: 4,
          text: 'lorem ipsum',
          from: 'User 2'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 1'
        },
        {
          id: 4,
          text: 'lorem ipsum',
          from: 'User 2'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 2'
        },
        {
          id: 4,
          text: 'lorem ipsum',
          from: 'User 2'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 1'
        },
        {
          id: 4,
          text: 'lorem ipsum',
          from: 'User 1'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 1'
        }, {
          id: 4,
          text: 'lorem ipsum',
          from: 'User 3'
        },
        {
          id: 5,
          text: 'lorem ipsum',
          from: 'User 3'
        }
      ]

    }
  },

  methods: {
    scrollToBottom() {
      nextTick(() => {
        const messagesContainer = ref<HTMLElement | null>(null)
        if (messagesContainer.value) {
          window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
        }
      })
    },

    messageNotif(from: string, text: string) {
      if (this.$q.appVisible) {
        this.$q.notify({
          message: from,
          caption: text,
          color: 'secondary'
        })

      }

    },


    handleTyping() {
      if (this.typingTimeout !== null) {
        clearTimeout(this.typingTimeout)
      }

      this.isTyping = true

      // Set a delay to hide "is typing" message after user stops typing
      this.typingTimeout = window.setTimeout(() => {
        this.isTyping = false
      }, 1000) // 1 second delay after user stops typing
    },

    sendMessage() {
      const message = this.text.trim()

      const commands = ['/join', '/invite', '/revoke', '/kick', '/list', '/cancel', '/quit']



      if (message.startsWith(commands[0])) {
        // CREATE/JOIN CHANNEL
        console.log('CREATE/JOIN CHANNEL')
        let publicity = true
        let channelName = message.split(' ')
        if (channelName[channelName.length - 1] === '[private]') {
          publicity = false
          channelName = channelName.slice(1, -1)
        }
        else {
          publicity = true
          channelName = channelName.slice(1)
        }

        const channel = {
          name: channelName.join(' '),
          // caption: 'first-channel',
          icon: null,
          is_private: publicity
          // link: ''
        }
        if (channel.name.trim() !== '') {
          this.$store.commit('ui/addChannel', channel)
        }
        //  this.addChannelNotif(this.channelName.trim());


      }
      else if (message.startsWith(commands[1])) {
        // INVITE BROSKI
        console.log('INVITE BROSKI')
        const userName = message.split(' ')[1]

        const user = {
          name: userName,
          status: 'added user',
          icon: '',
          state: 'online'
        }
        if (user.name !== '') {
          this.$store.commit('ui/addMember', user)
        }

      }
      else if (message.startsWith(commands[2])) {
        // PRIVATE KICK
        console.log('PRIVATE KICK')
        const userName = message.split(' ')[1]

        const user = {
          name: userName,
          status: '',
          icon: '',
          state: ''
        }
        this.$store.commit('ui/kickMember', user)

      }
      else if (message.startsWith(commands[3])) {
        // PUBLIC KICK
        console.log('PUBLIC KICK')
        const userName = message.split(' ')[1]

        const user = {
          name: userName,
          status: '',
          icon: '',
          state: ''
        }
        this.$store.commit('ui/kickMember', user)

      }
      else if (message.startsWith(commands[4])) {
        // LIST MEMBERS
        console.log('MEMBERS')
        this.$store.commit('ui/toggleMembersDrawer')

      }
      else if (message.startsWith(commands[5])) {
        // LEAVE CHANNEL
        console.log('LEAVE CHANNEL')
        this.$store.commit('ui/deleteChannel')
      }
      else if (message.startsWith(commands[6])) {
        // DELETE CHANNEL BY OWNER
        console.log('DELETE CHANNEL BY OWNER')
        this.$store.commit('ui/deleteChannel')

      }

      else {
        if (message !== '') {
          const newMessage = {
            id: 7,
            text: message,
            from: 'user'
          }

          this.messages.push(newMessage)
          this.messageNotif(newMessage.from, message)

          nextTick(() => {
            this.scrollToBottom()
          })


        }
        this.text = ''
        this.isTyping = false
        clearTimeout(this.typingTimeout!)
      }
    },

    onLoad(index: number, done: (stop?: boolean) => void) {
      setTimeout(() => {
        const messages = [
          {
            id: this.page * 3 + 1,
            text: 'old Message',
            from: 'user'
          },
          {
            id: this.page * 3 + 2,
            text: 'old Message',
            from: 'user'
          },
          {
            id: this.page * 3 + 3,
            text: 'old Message',
            from: 'user'
          }
        ]
        this.messages = [...messages, ...this.messages]
        this.page += 1
        done()


      }, 1000)
    }



  },



  mounted() {
    // Scroll to the bottom when the component is mounted
    nextTick(() => {
      this.scrollToBottom()
    })
  },


  watch: {
    text() {
      this.handleTyping()
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