<template>
  <q-header class="z-top" elevated>
    <q-toolbar>

      <q-btn flat @click="toggleChannelsDrawer">
        <q-avatar size="40px" text-color="white" class="q-ml-sm" square>
          <img src="src\assets\logo.png" alt="logo">
        </q-avatar>

      </q-btn>

      <q-avatar icon="tag" class="q-ml-lg" />

      <q-toolbar-title>
        {{ selectedChannel == null ? '' : selectedChannel.name }}
      </q-toolbar-title>

      <q-btn dense flat round icon="account_circle" @click="openProfile" />

      <q-btn dense flat round icon="group" @click="toggleMembersDrawer" />

      <SettingsMenu></SettingsMenu>


      <!--Message Search Maybe later-->
      <!-- <q-input outlined v-model="text1" label="Search" maxlength="30" rounded class="q-pa-sm" dense bg-color="white" >
       </q-input> -->


    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent } from 'vue'
import SettingsMenu from 'src/components/SettingsMenu.vue'


export default defineComponent({
  name: 'NavBar',
  components: { SettingsMenu },

  setup() {
    return {
    }


  },
  computed: {
    loggedInProfile: {
      get() {
        return this.$store.state.ui.loggedInProfile
      }
    },
    selectedChannel: {
      get() {
        return this.$store.state.ui.selectedChannel
      }
    }
  },
  methods: {
    openProfile() {
      this.$store.commit('ui/switchUserProfile', this.loggedInProfile)
      this.$store.commit('ui/toggleUserProfile')
    },
    toggleMembersDrawer() {
      this.$store.commit('ui/toggleMembersDrawer')
    },
    toggleChannelsDrawer() {
      this.$store.commit('ui/toggleChannelsDrawer')
    }
  }

})

</script>

<style scoped></style>