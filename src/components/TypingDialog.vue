<template>
    <q-dialog v-model="typingDialog" class="full-width" @escape-key="closeDialog" no-backdrop-dismiss no-shake>
      <q-card style="min-width: 400px; max-width: 400px">
        <div class="bg-primary full-width banner"> </div>
        <q-item>
          <q-item-section>

            <q-item-label lines="5" style="white-space: pre-wrap;">a: IOASJDIOASJIOJDOIASjOIJAS</q-item-label>
  
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>

            <q-item-label lines="5" style="white-space: pre-wrap;">b: ASDLKSJADLKLSJDAKLDJSLKADJSLAJk</q-item-label>
  
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>

            <q-item-label lines="5" style="white-space: pre-wrap;">c: SADKLJSALDJSALKDJLKADJLSJLj</q-item-label>
  
          </q-item-section>
        </q-item>
  
        <q-card-actions>
          <q-btn flat label="Close" @click="closeDialog" color="primary" />
        </q-card-actions>
      </q-card>
  
    </q-dialog>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'TypingDialog',
    components: {},
  
    computed: {
        typingDialog() {
            return this.$store.state.ui.typingDialogState
        }
    },
    methods: {
      closeDialog() {
        this.$store.commit('ui/toggleTypingDialog')
      }
    }
  
  })
  </script>
  
