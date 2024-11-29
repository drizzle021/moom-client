<template>
  <q-item :class="text.includes('@' + currentUser?.nickname) ? 'msg hovered mentioned' : 'msg hovered'">
    <q-item-section side>
      <q-avatar size="50px">
        <img :src="author.icon">
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label><b>{{ author.nickname }}</b></q-item-label>
      <q-item-label class="message-text">{{ text }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'
import { User } from 'src/contracts'

export default defineComponent({
  name: 'MessageComponent',
  props: {
    text: {
      type: String,
      required: true
    },
    author: {
      type: User,
      required: true
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    }
  },

  // Ez kell ide mert for some reason nem tudom a backendrol igy elkuldeni egyben
  // MemberDrawerbe el tudom ugy kuldeni szoval a message gettelessel van baj
  methods: {
    getFullIconUrl(icon) { 
      const baseUrl = 'http://localhost:3333/uploads'
      return icon ? `${baseUrl}/${icon}` : null 
    }
  }
 

})
</script>

<style scoped lang="scss">
.msg {
  display: flex;
  align-items: flex-start;
  margin-right: 30px;
  padding: 10px;
  border-radius: 8px;
  word-break: break-word;
}

.message-text {
  white-space: pre-wrap;
}

.hovered:not(.mentioned):hover {
  background-color: $grey-3
}

.mentioned {
  background-color: $yellow-3
}

.mentioned:hover {
  background-color: $yellow-4
}
</style>