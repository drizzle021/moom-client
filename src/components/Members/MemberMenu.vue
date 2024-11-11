<template>
  <q-menu anchor="bottom left" self="top left" context-menu>
    <q-item clickable @click="openProfile">
      <q-item-section>Profile</q-item-section>
    </q-item>
    <q-item clickable @click="mentionUser">
      <q-item-section>Mention</q-item-section>
    </q-item>
    <q-item clickable>
      <q-item-section>Revoke</q-item-section>
    </q-item>
    <q-item clickable @click="kickMember">
      <q-item-section>Kick</q-item-section>
    </q-item>
  </q-menu>



</template>


<script>
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'MemberMenu',
  components: {},
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  setup() {
    return {

    }

  },

  methods: {
    openProfile() {
      this.$store.commit('ui/switchUserProfile', this.user)
      this.$store.commit('ui/toggleUserProfile')
    },
    mentionUser() {
      console.log(this.user.name)
    },
    kickMember() {
      this.$store.commit('ui/kickMember', this.user)
    }
  }

})
</script>