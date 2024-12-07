<template>
    <q-dialog v-model="typingDialog" class="full-width" @escape-key="closeDialog" no-backdrop-dismiss no-shake>
      <q-card style="min-width: 400px; max-width: 400px">
        <q-card-section>
        <div class="text-h6">Currently Typing:</div>
      </q-card-section>
        <q-item v-for="(message, index) in typedMessages" :key="index">
          <q-item-section side>
            <q-avatar size="50px">
              <img :src="message.author.icon">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label><b>{{ message.author.nickname }}</b></q-item-label>
            <q-item-label style="white-space: pre-wrap; word-break: break-word;"> {{message.content}}</q-item-label>
          </q-item-section>
        </q-item>
  
        <q-card-actions>
          <q-btn flat label="Close" @click="closeDialog" color="primary" />
        </q-card-actions>
      </q-card>
  
    </q-dialog>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { mapGetters } from 'vuex'

  export default defineComponent({
    name: 'TypingDialog',
    components: {},
  
    computed: {
      ...mapGetters('channels', {
          typedMessages: 'currentlyTypedMessages'
        }),
        typingDialog() {
            return this.$store.state.ui.typingDialogState
        }
        // },
        // typedMessages(){
        //   return this.$store.state.channels.typedMessages
        // }
    },
    methods: {
      closeDialog() {
        this.$store.commit('ui/toggleTypingDialog')
      }
    }
  
  })
  </script>
  
