<template>
  <q-layout view="hHh LpR lfr">

    <q-page-container>
      <router-view />
    </q-page-container>


  </q-layout>

</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout'
})
</script>
