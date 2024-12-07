<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-primary full-bg row flex-center">
        <div class="q-pa-md column flex-center relative-container form-wrapper">
          <div class="q-gutter-md form-container">
            <q-card class="background-light">
              <q-tabs v-model="tab" indicator-color="primary" active-color="primary" align="justify" narrow-indicator
                dense>
                <q-tab name="login" label="Log In" ripple="false" />
                <q-route-tab name="register" label="Register" ripple="false" :to="{ name: 'register' }" />
              </q-tabs>
              <q-separator />
              <q-tab-panels v-model="tab" class="background-light">
                <q-tab-panel name="login" style="min-width: 400px;max-width:400px">
                  <q-form ref="form" @keydown.enter.prevent="onSubmit">
                    <div class="q-gutter-y-sm q-mt-lg">
                      <label class="q-mb-xs "> EMAIL <span class="required-asterisk">*</span> </label>
                      <q-input v-model="credentials.email" type="email" bg-color="white" borderless />
                    </div>
                    <div class="q-gutter-y-sm q-mt-lg">
                      <label class="q-mb-xs"> PASSWORD <span class="required-asterisk">*</span> </label>
                      <q-input v-model="credentials.password" type="password" bg-color="white" borderless />
                    </div>
                    <div class="row flex-center q-my-md">
                      <q-btn text-color="white" class="bg-primary" :loading="loading" @click="onSubmit"> Log In </q-btn>
                    </div>
                  </q-form>
                </q-tab-panel>
                <q-tab-panel name="register" style="min-width: 400px;max-width:400px">

                </q-tab-panel>
              </q-tab-panels>
            </q-card>

          </div>
        </div>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw, useRouter, useRoute } from 'vue-router'

export default defineComponent({

  name: 'LoginPage',
  data() {
    const router = useRouter()
    const route = useRoute()
    return {
      form: { nickname: '', email: '', password: '', name: '', surname: '' },
      credentials: { email: '', password: '' },
      file: null,
      tab: 'login',
      router,
      route
    }
  },

  computed: {
    redirectTo(): RouteLocationRaw {
      return (this.route.query.redirect as string) || { name: 'chat' }
    },
    loading(): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },

  methods: {
    onSubmit() {
      this.$store.dispatch('auth/login', this.credentials).then(() => this.router.push(this.redirectTo))
    }
  }
})
</script>

<style scoped lang="scss">
.full-bg {
  background-image: url('src/assets/moombg.png') !important;
  background-repeat: no-repeat !important;
  background-size: contain !important;
  background-color: $primary;
  background-position: center !important;
  height: 100vh;
}

@media (max-width: 1024px) {
  .full-bg {
    background-image: none !important;
  }
}

q-tab {
  color: black;
}

.background-light {
  background-color: #E9ebf8;
}

.required-asterisk {
  color: red;
}
</style>
