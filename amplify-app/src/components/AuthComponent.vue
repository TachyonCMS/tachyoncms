<template>
  <q-card class="bg-card-paper on-card-paper">
    <q-card-section class="text-center justify-center" v-if="view == 'access'">
      <q-tabs
        v-model="authTab"
        switch-indicator
        indicator-color="primary"
        class="q-mb-md"
      >
        <q-route-tab
          label="Sign in"
          name="signin"
          to="/auth/login"
          :class="authTab != 'signin' ? 'back-tab' : 'top-tab'"
        ></q-route-tab>
        <q-route-tab
          label="Create Account"
          name="signup"
          to="/auth/signup"
          :class="authTab != 'signup' ? 'back-tab' : 'top-tab'"
        ></q-route-tab>
      </q-tabs>
      <q-input label="Username" v-model="username"></q-input>
      <q-input
        label="Password"
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          ></q-icon> </template
      ></q-input>
      <template v-if="authTab == 'signup'">
        <q-input
          label="Confirm password"
          v-model="password2"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon>
          </template>
        </q-input>
        <q-input label="Email" v-model="email"></q-input>
        <vue3-q-tel-input
          label="Telephone"
          v-model:tel="tel"
          :required="false"
          class="q-py-sm"
        />
        <q-input label="Full name" v-model="commonName"></q-input>
      </template>
      <q-tab-panels v-model="authTab" animated class="q-mt-md">
        <q-tab-panel name="signup" class="bg-card-paper">
          <q-btn label="Create Account" class="bg-primary on-primary"></q-btn>
        </q-tab-panel>

        <q-tab-panel name="signin" class="bg-card-paper">
          <div>
            <q-btn
              label="Sign In"
              class="bg-primary on-primary"
              @onclick="platformSignIn()"
            ></q-btn>
          </div>
          <q-btn
            class="q-mt-lg text-lt3 text-body1"
            flat
            no-caps
            to="/auth/password_reset"
            >Reset password</q-btn
          >
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <q-card-section
      v-if="view == 'passwdReset'"
      class="text-center justify-center"
    >
      <div class="text-h4">Password Reset</div>
    </q-card-section>

    <q-card-section
      class="text-center justify-center"
      v-if="view == 'passwdReset' && resetStage == 'enterUsername'"
    >
      <div class="q-mx-md">
        Enter your username, we will send a reset code to the email address on
        file.
      </div>
      <q-input label="Username" v-model="username"></q-input>
    </q-card-section>
    <q-card-section v-if="view == 'passwdReset' && resetStage == 'enterCode'">
      <div class="text-h6">Reset Code:</div>
      <q-input
        label="Code"
        v-model="resetCode"
        :type="isResetPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isResetPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isResetPwd = !isResetPwd"
          ></q-icon> </template
      ></q-input>
      <div class="text-h6 q-mt-lg">New Password:</div>
      <q-input
        label="Password"
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          ></q-icon> </template
      ></q-input>

      <q-input
        label="Confirm password"
        v-model="password2"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          ></q-icon>
        </template>
      </q-input>
    </q-card-section>

    <q-card-actions class="text-center justify-center">
      <div v-if="view == 'passwdReset'">
        <div v-if="resetStage == 'enterUsername'">
          <div class="row col-12 justify-center text-center">
            <q-btn
              class="q-mt-sm bg-primary on-primary"
              @click="sendResetCode()"
              >Send Reset Code</q-btn
            >
          </div>
          <div>
            <q-btn
              class="q-my-lg text-lt3 text-body1"
              flat
              no-caps
              to="/auth/login"
              >Back to Login</q-btn
            >
          </div>
        </div>
        <div v-if="resetStage == 'enterCode'">
          <div class="row col-12 justify-center text-center">
            <q-btn class="q-mt-sm bg-primary on-primary" @click="savePassword()"
              >Save new password</q-btn
            >
          </div>
          <div>
            <q-btn
              class="q-my-lg text-lt3 text-body1"
              flat
              no-caps
              @click="resendCode()"
              >Resend code</q-btn
            >
          </div>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script  setup>
import { ref, unref, watch, toRef } from "vue";

const props = defineProps({
  view: String,
});

// ONLY FOR DEMO, NOT REQUIRED FOR PROD
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
const auth = useAuthenticator();

import Vue3QTelInput from "vue3-q-tel-input";
import "../../node_modules/vue3-q-tel-input/dist/vue3-q-tel-input.esm.css";

import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

const authTab = ref(""); // Tied to router, this cannot have a default value not

const passwdResetSubview = ref("enter-username");

const username = ref(null);
const password = ref(null);
const password2 = ref(null);
const commonName = ref(null);
const email = ref(null);
const tel = ref("");

const isPwd = ref(true);
const isResetPwd = ref(true);
const emailValid = ref(false);

const lostPasswd = ref(false);

const resetCode = ref(null);

const resetStage = ref("enterUsername");

const platformSignIn = async () => {};

const sendResetCode = async () => {
  console.log("Sending reset code");
  resetStage.value = "enterCode";
};
</script>

<style lang="scss">
</style>
