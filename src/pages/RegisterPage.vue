<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <q-page class="bg-primary full-bg row flex-center">
                <div class="q-pa-md column flex-center relative-container form-wrapper">
                    <div class="q-gutter-md form-container">
                        <q-card class="background-light">
                            <q-tabs v-model="tab" indicator-color="primary" active-color="primary" align="justify"
                                narrow-indicator dense>
                                <q-route-tab name="login" label="Log In" ripple="false" to="/" />
                                <q-tab name="register" label="Register" ripple="false" />
                            </q-tabs>
                            <q-separator />
                            <q-tab-panels v-model="tab" class="background-light">
                                <q-tab-panel name="register" style="min-width: 400px;max-width:400px">
                                    <q-form ref="form">
                                        <div class="q-gutter-y-sm q-mt-lg">
                                            <label class="q-mb-xs "> NAME <span class="required-asterisk">*</span>
                                            </label>
                                            <q-input v-model="form.name" bg-color="white" borderless />
                                        </div>
                                        <div class="q-gutter-y-sm q-mt-lg">
                                            <label class="q-mb-xs "> SURNAME <span class="required-asterisk">*</span>
                                            </label>
                                            <q-input v-model="form.surname" bg-color="white" borderless />
                                        </div>
                                        <div class="q-gutter-y-sm q-mt-lg">
                                            <label class="q-mb-xs "> NICKNAME <span class="required-asterisk">*</span>
                                            </label>
                                            <q-input v-model="form.nickname" bg-color="white" borderless />
                                        </div>
                                        <div class="q-gutter-y-sm q-mt-lg">
                                            <label class="q-mb-xs "> EMAIL <span class="required-asterisk">*</span>
                                            </label>
                                            <q-input v-model="form.email" type="email" bg-color="white" borderless />
                                        </div>
                                        <div class="q-gutter-y-sm q-mt-lg">
                                            <label class="q-mb-xs"> PASSWORD <span class="required-asterisk">*</span>
                                            </label>
                                            <q-input v-model="form.password" type="password" bg-color="white"
                                                borderless />
                                        </div>
                                        <div class="row flex-center q-my-md">
                                            <q-file v-model="form.file" label="upload pfp" filled max-files="1"
                                                class="q-mx-auto">
                                                <template v-slot:prepend>
                                                    <q-icon name="attach_file" />
                                                </template>
                                            </q-file>
                                            <q-btn text-color="white" class="bg-primary q-mx-md" :loading="loading"
                                                @click="onSubmit">
                                                Register </q-btn>
                                        </div>
                                    </q-form>
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
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
    name: 'RegisterPage',
    data() {
        return {
            form: { name: '', nickname: '', surname: '', email: '', password: '', passwordConfirmation: '', file: null },
            showPassword: false,
            tab: 'register'
        }
    },
    computed: {
        redirectTo(): RouteLocationRaw {
            return { name: 'login' }
        },
        loading(): boolean {
            return this.$store.state.auth.status === 'pending'
        }
    },
    methods: {
        onSubmit() {
            this.$store.dispatch('auth/register', this.form).then(() => this.$router.push(this.redirectTo))
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