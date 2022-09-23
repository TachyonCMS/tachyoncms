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

      <div v-if="errors.length > 0">
        <ul class="text-negative justify-left text-left">
          <li v-for="(error, ix) in errors" :key="ix" class="text-body1">
            {{ error }}
          </li>
        </ul>
      </div>

      <div class="row col-12 float-right text-italic">
        Required <span class="text-red text-bold">*</span>
      </div>

      <q-input label="Username" v-model="username" required></q-input>

      <q-input
        label="Password"
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
        required
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          ></q-icon> </template
      ></q-input>
      <div
        v-if="authTab == 'signup' && password && !validatePassword(password)"
      >
        Passwords must be 12 or more characters
      </div>
      <template v-if="authTab == 'signup'">
        <q-input
          label="Confirm password"
          v-model="password2"
          :type="isPwd ? 'password' : 'text'"
          required
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon>
          </template>
        </q-input>
        <div
          v-if="
            authTab == 'signup' && password && password2 && !passwordConfirmed()
          "
        >
          The passwords must match
        </div>

        <q-input label="Email" v-model="email" type="email" required></q-input>
        <div
          v-show="
            authTab == 'signup' &&
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          "
        >
          Enter a valid email address
        </div>

        <vue3-q-tel-input
          label="Telephone"
          v-model:tel="telephone"
          :required="false"
          class="q-py-sm"
          type="tel"
        />
        <q-input label="Full name" v-model="commonName"></q-input>
      </template>
      <q-tab-panels v-model="authTab" animated class="q-mt-md">
        <q-tab-panel name="signup" class="bg-card-paper">
          <q-btn
            label="Create Account"
            class="bg-primary on-primary"
            @click="platformSignUp()"
            :disable="!validToCreate"
          ></q-btn>
        </q-tab-panel>

        <q-tab-panel name="signin" class="bg-card-paper">
          <div>
            <q-btn
              label="Sign In"
              class="bg-primary on-primary"
              @click="platformSignIn()"
            ></q-btn>
          </div>
          <q-btn
            class="q-mt-lg text-card-subdued text-body1"
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
      <div class="q-mx-md q-mb-lg text-body1">
        Enter your username, a reset code will be sent to the email address on
        file.
      </div>
      <div v-if="errors.length > 0">
        <ul class="text-negative justify-left text-left">
          <li
            v-for="(error, ix) in errors"
            :key="ix"
            class="text-body1 text-weight-bold"
          >
            {{ error }}
          </li>
        </ul>
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

    <q-card-section v-if="view == 'changePassword'">
      <div v-if="errors.length > 0">
        <ul class="text-negative justify-left text-left">
          <li
            v-for="(error, ix) in errors"
            :key="ix"
            class="text-body1 text-weight-bold"
          >
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="text-h6">Current Password:</div>
      <q-input
        label="Current Password"
        v-model="currentPassword"
        :type="isCurrentPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            :name="isCurrentPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isCurrentPwd = !isCurrentPwd"
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

    <q-card-actions
      class="text-center justify-center"
      v-if="view == 'passwdReset'"
    >
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
              class="q-my-lg text-card-subdued text-body1"
              flat
              no-caps
              to="/auth/login"
              >Back to Sign In</q-btn
            >
          </div>
        </div>
        <div v-if="resetStage == 'enterCode'">
          <div class="row col-12 justify-center text-center">
            <q-btn
              class="q-mt-sm bg-primary on-primary"
              @click="resetPassword()"
              >Save new password</q-btn
            >
          </div>
          <div>
            <q-btn
              class="q-my-lg text-card-subdued text-body1"
              flat
              no-caps
              @click="sendResetCode()"
              >Resend code</q-btn
            >
          </div>
        </div>
      </div>
      <div v-if="view == 'changePassword'">
        <q-btn
          class="q-mt-sm bg-primary on-primary"
          @click="changePlatformPassword()"
          >Save New Password</q-btn
        >
      </div>
    </q-card-actions>
  </q-card>
</template>

<script  setup>
import { ref, computed } from "vue";

const props = defineProps({
  view: String,
});

// ONLY FOR DEMO, NOT REQUIRED FOR PROD
//import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
//const auth = useAuthenticator();

import Vue3QTelInput from "vue3-q-tel-input";
import "../../node_modules/vue3-q-tel-input/dist/vue3-q-tel-input.esm.css";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import useAuth from "../composables/useAuth";
const {
  signIn,
  signUp,
  requestResetCode,
  submitResetCode,
  getCurrentUser,
  changePassword,
  validatePassword,
  validateEmail,
} = useAuth();

const authTab = ref(""); // Tied to router, this cannot have a default value not

const passwdResetSubview = ref("enter-username");

const errors = ref([]);

const username = ref(null);
const password = ref(null);
const password2 = ref(null);
const currentPassword = ref(null);
const commonName = ref(null);
const email = ref(null);
const telephone = ref("");

const isPwd = ref(true);
const isResetPwd = ref(true);
const isCurrentPwd = ref(true);
const emailValid = ref(false);

const lostPasswd = ref(false);

const resetCode = ref(null);

const resetStage = ref("enterUsername");

const platformSignIn = async () => {
  try {
    const user = await signIn(username.value, password.value);
    if (user) {
      userStore.$patch({
        username: user.username,
        email: user.email,
        fullname: user.name,
        authenticated: true,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const sendResetCode = async () => {
  console.log("Sending reset code");
  try {
    await requestResetCode(username.value);
    resetStage.value = "enterCode";
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const resetPassword = async () => {
  console.log("Sending reset code");
  try {
    await submitResetCode(userStore.username, resetCode.value, password.value);
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const changePlatformPassword = async () => {
  console.log("Changing password");
  try {
    if (password.value != password2.value) {
      throw "New passwords must match.";
    }
    const userObj = await getCurrentUser();
    await changePassword(userObj, currentPassword.value, password.value);
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const platformSignUp = async () => {
  try {
    if (password.value != password2.value) {
      throw "Passwords much match.";
    }
    console.log(telephone.value);
    const userObj = {
      username: username.value,
      password: password.value,
      email: email.value, // optional
      telephone: "+" + telephone.value.replace(/\D/g, ""), // optional - E.164 number convention
      commonName: commonName.value, // optional
    };
    const user = await signUp(userObj);
    if (user) {
      userStore.$patch({
        username: user.username,
        email: user.email,
        commonName: user.commonName,
        authenticated: true,
      });
    }
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const passwordConfirmed = () => {
  return password.value == password2.value ? true : false;
};

const validToCreate = computed(() => {
  return validatePassword(password.value) &&
    passwordConfirmed() &&
    username.value &&
    username.value.length > 0 &&
    validateEmail(email.value)
    ? true
    : false;
});
</script>

<style lang="sass">
.q-field__native[required] ~ .q-field__label:after
  content: '*'
  color: red
</style>
