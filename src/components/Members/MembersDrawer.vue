<template>
  <q-drawer v-model="membersDrawerState" side="right" :width="400" show-if-above>

    <q-list>
      <q-item-label header>
        <q-btn dense flat icon="add" @click="addMemberDialog = true" label="add member" class="q-mt-md-sm q-mt-xs-xl" />

      </q-item-label>
      <q-separator />

      <q-item v-for="(member, index) in users" :key="index" v-bind="member" clickable>

        <q-item-section side>
          <!-- <q-avatar v-if="member.icon != ''" size="3rem"><img :src="member.icon"></q-avatar> -->
          <!-- v-else  -->
          <q-avatar rounded icon="person"></q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ member.nickname }}</q-item-label>
          <q-item-label lines="1">{{ member.status }}</q-item-label>
        </q-item-section>


        <q-item-section side>
          <q-badge :color="member.state == 'online' ? 'green-7' : member.state == 'offline' ? 'grey-7' : 'red-7'">
            {{ member.state == 'online' ? 'Online' : member.state == 'offline' ? 'Offline' : 'DnD' }}
          </q-badge>
        </q-item-section>



        <MemberMenu :user="member" />
      </q-item>



    </q-list>

  </q-drawer>




  <q-dialog v-model="addMemberDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">User Nickname</div>
      </q-card-section>

      <q-form @submit.prevent="addMember">
        <q-card-section class="q-pt-none">
          <q-input dense v-model="nickname" autofocus @keyup.enter="addMemberDialog = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn type="submit" flat label="Add Member" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup />

        </q-card-actions>
      </q-form>
    </q-card>

  </q-dialog>








</template>

<script>
import { defineComponent, ref } from 'vue'
import MemberMenu from 'src/components/Members/MemberMenu.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'


export default defineComponent({
  name: 'MembersDrawer',
  components: { MemberMenu },

  setup() {



    return {
      addMemberDialog: ref(false),
      nickname: ref('')
    }

  },
  data() {
    return {


    }
  },

  computed: {
    ...mapGetters('channels', {
      users: ['currentUsers']
    }),
    
    membersDrawerState: {
      get() {
        return this.$store.state.ui.membersDrawerState
      }

      /*         set(val){
                this.$store.commit('ui/updateMemberDrawerState',val)
              } */

    },
    memberList: {
      get() {
        return this.$store.state.ui.memberList
      }
    },

    loggedInProfile: {
      get() {
        return this.$store.state.ui.loggedInProfile
      }
    }
  },

  methods: {

    async addMember() {
      // ADD PROPER VERIFICATION OF NAMES AND INFORM THE USER
      if (this.nickname.trim() !== '') {

        await this.addMemberAction({ name: this.nickname })


        const user = {
          name: this.nickname.trim(),
          status: 'added user',
          icon: '',
          state: 'online'
        }
        if (user.name !== '') {
          this.$store.commit('ui/addMember', user)

        }
      }

      this.nickname = ''

    },

    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),


    ...mapActions('channels', ['addMemberAction'])


  },

  mounted() {
    if (this.memberList.length === 0) {
      this.$store.commit('ui/addMember', this.loggedInProfile)
    }

  }


})



</script>

<style scoped></style>