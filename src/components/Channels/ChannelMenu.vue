<template>
  <q-menu anchor="bottom left" self="top left" context-menu>
    <q-item clickable @click="openSettings">
      <q-item-section>Settings</q-item-section>
    </q-item>
    <q-item clickable @click="delete_">
      <q-item-section>Delete</q-item-section>
    </q-item>


  </q-menu>

</template>


<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { Channel } from 'src/contracts'


export default defineComponent({
  name: 'ChannelMenu',
  components: {},
  props: {
    channel: {
      type: Channel,
      required: true
    }
  },

  methods: {
    ...mapActions('channels', ['deleteChannel']),

    async delete_() {
      // this.$store.commit('ui/deleteChannel', this.channel)
      
      await this.deleteChannel(this.channel.name)
      console.log('delete')
    },
    openSettings() {
      console.log('settings')
    }
  }


})
</script>