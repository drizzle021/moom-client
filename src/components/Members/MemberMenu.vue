<template>
  <q-menu anchor="bottom left" self="top left" context-menu>
    <q-item clickable @click="openProfile">
      <q-item-section>Profile</q-item-section>
    </q-item>
    <q-item clickable @click="mentionUser">
      <q-item-section>Mention</q-item-section>
    </q-item>
    <q-item clickable @click ="revokeMember">
      <q-item-section>Revoke</q-item-section>
    </q-item>
    <q-item clickable @click="kickMember">
      <q-item-section>Kick</q-item-section>
    </q-item>
  </q-menu>



</template>


<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'


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
    ...mapActions('channels', ['revokeUser', 'kickUser']),

    openProfile() {
      this.$store.commit('ui/switchUserProfile', this.user)
      this.$store.commit('ui/toggleUserProfile')
    },
    mentionUser() {
      console.log(this.user.name)
    },
    async kickMember() {
      await this.kickUser(this.user.name)
    },
    async revokeMember(){
      await this.revokeUser(this.user.name)
    }
  }

})
</script>