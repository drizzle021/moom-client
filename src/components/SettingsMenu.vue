<template>
  <q-btn dense flat round icon="settings">
    <q-menu>
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <div class="text-h6 q-mb-md">Settings</div>
          <q-toggle v-model="notification" label="Notifications only addressed to me" />
          <q-option-group :options="options" type="radio" @click="setUserState" v-model="state" />
          <q-btn color="primary" label="Logout" size="md" v-close-popup @click="logout" />
        </div>
      </div>
    </q-menu>

  </q-btn>
</template>

<script>

</script>

<script>
import { defineComponent, ref, computed } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
    name: 'SettingsMenu',
    components:{},

    data(){
      const currentUserState = this.$store.state.auth.userStatus || 'ONLINE'
      
      return{
        notification: ref(false),
        state: ref(currentUserState),
        options: [
        { label: 'Online', value: 'ONLINE', color: 'green' },
        { label: 'Do not Disturb', value: 'DND', color: 'red' },
        { label: 'Offline', value: 'OFFLINE', color: 'grey' }
        ],
        currentUserState
      }
    },

    methods:{
      ...mapActions('auth', ['logout', 'setStatus']),


      async setUserState() {
        console.log(this.$store.state.auth.userStatus)
        await this.setStatus(this.state)
        
      }
    },

    watch:{
        state(newState){
          this.setStatus(newState)
       }
    }

})
</script>