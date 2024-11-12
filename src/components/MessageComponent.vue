<template>
  <q-item :class="message.text.includes('@' + this.loggedInProfile.name) ? 'msg hovered mentioned' : 'msg hovered'">
    <q-item-section side>
      <q-avatar size="50px">
        <img src={{ author.icon }} />
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
export default defineComponent({
  name: 'MessageComponent',
  props: {
    text: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  },

  computed: {
    loggedInProfile: {
      get() {
        return this.$store.state.ui.loggedInProfile
      }
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