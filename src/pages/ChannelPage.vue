<template>
  <q-page class='column justify-end' ref='messagesContainer'>
    <q-infinite-scroll reverse @load='onLoad' :offset='100'>
      <!-- <template v-slot:loading>
        <div class='row justify-center q-my-md'>
          <q-spinner color='primary' size='40px' />
        </div>
      </template> -->
      <MessageComponent v-for='message in messages' 
        :key='message.id' 
        :text='[message.content]'
        :author='message.author' />
    </q-infinite-scroll>
  </q-page>

</template>


<script lang='ts'>

import MessageComponent from 'src/components/MessageComponent.vue'
import { SerializedMessage } from 'src/contracts'
import { defineComponent, nextTick, ref } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default defineComponent({
  components: { MessageComponent },
  name: 'ChannelPage',

  data() {
    return {
      page: 1
    }
  },

  computed: {
    ...mapGetters('channels', {
      messages: 'currentMessages'
    })



    // messages(): SerializedMessage[] {
    //   return this.$store.getters['channels/currentMessages']
    // }
  },

  methods: {
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),



    // onLoad(index: number) {
    //   // done: (stop?: boolean) => void

    //   // setTimeout(() => {
    //   //   const messages = [
    //   //     {
    //   //       id: this.page * 3 + 1,
    //   //       text: 'old Message',
    //   //       from: 'user'
    //   //     },
    //   //     {
    //   //       id: this.page * 3 + 2,
    //   //       text: 'old Message',
    //   //       from: 'user'
    //   //     },
    //   //     {
    //   //       id: this.page * 3 + 3,
    //   //       text: 'old Message',
    //   //       from: 'user'
    //   //     }
    //   //   ]
    //   //   this.messages = [...messages, ...this.messages]
    //   //   this.page += 1
    //   //   done()


    //   // }, 1000)

    // },
    scrollToBottom() {
      nextTick(() => {
        const messagesContainer = ref<HTMLElement | null>(null)
        if (messagesContainer.value) {
          window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
        }
      })
    }


  },

  mounted() {
    // Scroll to the bottom when the component is mounted
    nextTick(() => {
      this.scrollToBottom()
    })
  }

})

</script>
