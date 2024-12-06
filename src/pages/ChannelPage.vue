<template>
  <q-page class='column justify-end' ref='messagesContainer'>
      <q-infinite-scroll v-if="activeChannel != ''" reverse @load='onLoad' :offset='100'>
        <template v-slot:loading>
          <div class='row justify-center q-my-md'>
            <q-spinner v-show="hasMorePages" color='primary' size='40px' />
          </div>
        </template>
        <MessageComponent v-for='message in messages' 
          :key='message.id' 
          :text='message.content'
          :author='message.author' />
      </q-infinite-scroll>
  </q-page>

</template>


<script lang='ts'>

import MessageComponent from 'src/components/MessageComponent.vue'
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default defineComponent({
  components: { MessageComponent },
  name: 'ChannelPage',

  data() {
    return {
    }
  },

  computed: {
    ...mapGetters('channels', {
      messages: 'currentMessages'
    }),
    activeChannel() {
      return this.$store.state.channels.active
    },
    hasMorePages() {
      return this.$store.state.channels.hasMorePages
    }
  },

  methods: {
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),



    onLoad(index: number, done: (stop?: boolean) => void) {
      if (this.activeChannel === '' || !this.hasMorePages){
        done()
        return
      }

      
      this.$store.dispatch('channels/loadPage')
      .then(() => {
        done()
      })


    }



  }

})

</script>
