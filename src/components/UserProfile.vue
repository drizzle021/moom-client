<template>
  <q-dialog v-model="userProfileState" class="full-width" @escape-key="closeDialog" no-backdrop-dismiss no-shake>
    <q-card style="min-width: 400px; max-width: 400px">
      <div class="bg-primary full-width banner"> </div>
      <q-item>
        <q-item-section avatar>

          <div class="image-wrapper">
            <img :class="currentUser.id == selectedUser.id ? 'profile-image file-picker' : 'profile-image'"
              :src="selectedUser.icon ? selectedUser.icon : require('src/assets/kurumi.jpg')" draggable="false"
              @click="openFilePicker"
            >


            <q-badge class="profile-badge"
              :color="userState == 'ONLINE' ? 'green-7' : userState == 'OFFLINE' ? 'grey-7' : 'red-7'">
              {{ userState == 'ONLINE' ? 'Online' : userState == 'OFFLINE' ? 'Offline' : 'DND' }}
            </q-badge>
          </div>

          <q-file ref="fileInput" @input="handleFile" max-files="1" style="display: none;" />


        </q-item-section>
        <q-item-section style="word-break: break-word;">
          <q-item-label lines="5" style="white-space: pre-wrap;">{{ this.selectedUser.status }}</q-item-label>
        </q-item-section>

      </q-item>

      <q-card-section>
        <div class="text-h6">{{ this.selectedUser.nickname }}</div>
        <div>{{ this.selectedUser.name }} {{ this.selectedUser.surname }} | {{ this.selectedUser.email }}</div>
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
    currentUser() {
      return this.$store.state.auth.user
    },
    userState() {
      return this.$store.state.auth.userState
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit('ui/toggleUserProfile')
    },
    openFilePicker() {
      if (this.selectedUser.name === this.currentUser.name) {
        this.$refs.fileInput.pickFiles()
      }
    },
    handleFile(pfp) {
      if (pfp.target.files) {
        console.log('File selected:', pfp.target.files[0].name)

      }
    },
    getFullIconUrl(icon) { 
      const baseUrl = 'http://localhost:3333/uploads'
      return icon ? `${baseUrl}/${icon}` : null 
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