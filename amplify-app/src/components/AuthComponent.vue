<template>
  <q-card class="bg-card-paper on-card-paper">
    <q-card-section class="text-center justify-center">
      <q-tabs v-model="tab">
        <q-tab label="Sign up" name="signup"></q-tab>
        <q-tab label="Sign in" name="signin"></q-tab>
      </q-tabs>

      <q-separator></q-separator>

      <div class="text-h4 q-py-lg">
        <span v-if="tab == 'signup'">Join Now!</span
        ><span v-else>Welcome Back!</span>
      </div>

      <q-input label="Username" v-model="username"></q-input>
      <q-input label="Password" v-model="password" type="password"></q-input>
      <template v-if="tab == 'signup'">
        <q-input label="Confirm password" v-model="password2"></q-input>
        <q-input label="Email" v-model="email"></q-input>
        <q-input label="Full name" v-model="commonName"></q-input>
      </template>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="signup" class="bg-card-paper">
          <q-btn label="Sign Up"></q-btn>
        </q-tab-panel>

        <q-tab-panel name="signin" class="bg-card-paper">
          <div>
            <q-btn label="Sign In"></q-btn>
          </div>
          <div class="q-pt-lg">Lost Password?</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script  setup>
import { ref } from "vue";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
const auth = useAuthenticator();

import { useLayoutStore } from "../stores/layout";
const layoutStore = useLayoutStore();

const view = ref("access");
const tab = ref("signup");

const username = ref(null);
const password = ref(null);
const password2 = ref(null);
const commonName = ref(null);
const email = ref(null);
</script>

<style lang="scss">
</style>
