<template>
  <q-menu anchor="bottom left" self="top left" context-menu>
    <q-item clickable @click="openSettings">
      <q-item-section>Settings</q-item-section>
    </q-item>
    <q-item clickable @click="deleteChannel">
      <q-item-section>Delete</q-item-section>
    </q-item>


  </q-menu>

</template>


<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChannelMenu',
  components: {},
  props: ['channel'],

  methods: {
    deleteChannel() {
      // this.$store.commit('ui/deleteChannel', this.channel)
      console.log('delete')
    },
    openSettings() {
      console.log('settings')
    }
  }


})
</script>