<template>
  <q-dialog v-model="userProfileState" class="full-width" @escape-key="closeDialog" no-backdrop-dismiss no-shake>
    <q-card style="min-width: 400px; max-width: 400px">
      <div class="bg-primary full-width banner"> </div>
      <q-item>
        <q-item-section avatar>

          <div class="image-wrapper">
            <img :class="loggedInProfile == selectedUser ? 'profile-image file-picker' : 'profile-image'"
              :src="selectedUser.icon == '' ? 'src/assets/kurumi.jpg' : selectedUser.icon" draggable="false"
              @click="openFilePicker">


            <q-badge class="profile-badge"
              :color="selectedUser.state == 'online' ? 'green-7' : selectedUser.state == 'offline' ? 'grey-7' : 'red-7'">
              {{ selectedUser.state == 'online' ? 'Online' : selectedUser.state == 'offline' ? 'Offline' : 'DnD' }}
            </q-badge>
          </div>

          <q-file ref="fileInput" @input="handleFile" max-files="1" style="display: none;" />


        </q-item-section>
        <q-item-section style="word-break: break-word;">
          <q-item-label lines="5" style="white-space: pre-wrap;">{{ this.selectedUser.status }}</q-item-label>
        </q-item-section>

      </q-item>

      <q-card-section>
        <div class="text-h6">{{ this.selectedUser.name }}</div>
        <div>{{ this.selectedUser.firstName }} {{ this.selectedUser.lastName }} | {{ this.selectedUser.email }}</div>
      </q-card-section>
      <q-card-section>

      </q-card-section>

      <q-card-actions>
        <q-btn flat label="Close" @click="closeDialog" color="primary" />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserProfile',
  components: {},

  computed: {
    userProfileState: {
      get() {
        return this.$store.state.ui.userProfileState
      }
    },
    selectedUser: {
      get() {
        return this.$store.state.ui.userProfileSelected
      }
    },
    loggedInProfile: {
      get() {
        return this.$store.state.ui.loggedInProfile
      }
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit('ui/toggleUserProfile')
    },
    openFilePicker() {
      if (this.selectedUser.name === this.loggedInProfile.name) {
        this.$refs.fileInput.pickFiles()
      }
    },
    handleFile(pfp) {
      if (pfp.target.files) {
        console.log('File selected:', pfp.target.files[0].name)

      }
    }
  }

})
</script>

<style scoped lang="scss">
.banner {
  height: 100px
}

.image-wrapper {
  position: relative;
  height: auto;
  width: 100px;
  margin-right: 40px;
}

.profile-image {
  position: absolute;
  height: auto;
  transform: translateY(-65%);
  width: 128px;

  border-radius: 50%;
  border: 10px solid white;

}

.file-picker {
  transition: filter 0.3s
}

.file-picker:hover {
  cursor: pointer;
  filter: brightness(70%);
}

.profile-badge {
  position: absolute;
  height: auto;
  left: 80px;
  font-size: 1.1em;
  border: 3px solid white;
  user-select: none;
}
</style>