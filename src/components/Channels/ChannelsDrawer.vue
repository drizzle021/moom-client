<template>
  <q-drawer v-model="channelsDrawerState" show-if-above :width="100" class="bg-primary">
    <q-scroll-area style="height: inherit; ">
      <q-list class="column flex-center">
        <q-item @click="addChannelDialog = true" clickable class="q-mt-md-sm q-mt-xs-xl">
          <q-item-section>
            <q-avatar size="60px" color="secondary" text-color="white" icon="add">

            </q-avatar>
          </q-item-section>
        </q-item>

        <q-item v-for="(channel, index) in channels" :key="index" clickable @click="valamimas(channel)">
          <q-item-section>
            <q-avatar size="60px" color="secondary" text-color="white">
              {{ channel.name[0] }}
            </q-avatar>
            <!-- <q-avatar v-else size="60px">
              <img :src="channel.icon">
            </q-avatar> -->

            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" transition-show="fade"
              transition-duration="400" class="text-body1">
              {{ channel.name }}
            </q-tooltip>
          </q-item-section>

          <ChannelMenu :channel="channel" />
        </q-item>

      </q-list>

    </q-scroll-area>

  </q-drawer>

  <q-dialog v-model="addChannelDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Enter Channel name</div>
      </q-card-section>

      <q-form @submit.prevent="joinChannel">
        <q-card-section class="q-pt-none">
          <q-input dense v-model="channelName" autofocus @keyup.enter="addChannelDialog = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-toggle label="Private" v-model="publicity" />
        </q-card-section>

        <!--  <q-card-actions align="left" class="text-primary">
                <q-radio v-model="publicity" val="public" label="Public" />
                <q-radio v-model="publicity" val="private" label="Private" />
              </q-card-actions> -->

        <q-card-actions align="right" class="text-primary">
          <q-btn type="submit" flat label="Add Channel" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import ChannelMenu from './ChannelMenu.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'






export default defineComponent({
  name: 'ChannelsDrawer',
  components: { ChannelMenu },


  setup() {
    const $q = useQuasar()

    return {
      addChannelDialog: ref(false),
      channelName: ref(''),
      publicity: ref(false),

      addChannelNotif(channelName) {
        $q.notify({
          message: 'Joined channel: ' + channelName,
          // caption: 'created channel',
          color: 'secondary'
        })
      },

      deleteChannelNotif(channelName) {
        $q.notify({
          message: 'Deleted channel: ' + channelName,
          // caption: 'created channel',
          color: 'secondary'
        })
      }
    }

  },
  data() {
    return {

    }
  },

  computed: {
    ...mapGetters('channels', {
      channels: ['joinedChannels'],
      lastMessageOf: 'lastMessageOf'
    }),

    channelsDrawerState: {
      get() {
        return this.$store.state.ui.channelsDrawerState
      }

    },
    channelList: {
      get() {
        return this.$store.state.ui.channelList
      }

    },
    selectedChannel: {
      get() {
        return this.$store.state.ui.selectedChannel
      }
    },
    currentUser() {
      return this.$store.state.auth.user
    }


  },


  methods: {
    async valamimas(channel){
      await this.selectChannel(channel.name)
      // this.setActiveChannel(channel.name)
    },

    async joinChannel() {
      this.loading = true

      await this.createChannelAction({ name: this.channelName, admin_id: this.currentUser.id, is_private: this.publicity })

      this.channelName = ''
      this.loading = false
      console.log(this.channels)
    },

    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),


    ...mapActions('channels', ['createChannelAction', 'selectChannel']),



    deleteChannel(channel) {
      this.$store.commit('ui/deleteChannel', channel)
      // Notify the user
      this.deleteChannelNotif(channel.name)


    },
    channelClick(element) {
      console.log(element.name)
      this.$store.commit('ui/switchChannel', element)

    }
  }

  // pull saved channel from store add it to channels and switch to it
  // mounted() {
  //   if (this.channelList.length === 0) {
  //     this.$store.commit('ui/addChannel', this.selectedChannel)
  //     this.$store.commit('ui/switchChannel', this.selectedChannel)

  //   }
  // }
})



</script>

<style scoped></style>