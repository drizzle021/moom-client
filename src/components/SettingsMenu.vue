<template>
    <q-btn 
          dense 
          flat 
          round 
          icon="settings" 
        >
        <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-toggle v-model="notification" label="Notifications only addressed to me"/>
            <q-option-group
                :options="options"
                type="radio"
                v-model="state"
             />
            <q-btn
              color="primary"
              label="Logout"
              size="md"
              v-close-popup
              @click="logoutUser"
            />
          </div>
        </div>
      </q-menu>
      
      </q-btn>
</template>

<script>

</script>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'src/store'

export default defineComponent({
    name: 'SettingsMenu',
    components:{},

    setup(){
      const router = useRouter();

      // logout abd redirect user to login page
      const logoutUser = () => {
        router.push('/auth/login'); 
      }
      const store = useStore()
      const currentUserState = store.state.ui.loggedInProfile.state
      

      return{
        notification: ref(false),
        state: ref(currentUserState),
        options: [
        { label: 'Online', value: 'online', color: 'green' },
        { label: 'Do not Disturb', value: 'dnd', color: 'red' },
        { label: 'Offline', value: 'offline', color: 'grey' }
        ],
        logoutUser,
        currentUserState
      }
    },

    watch:{
        state(newState){
          this.$store.commit('ui/switchUserState', newState)
        }
    }

})
</script>