<template>
  <q-card class="bg-card-paper on-card-paper">
    <form>
      <q-card-section
        class="text-center justify-center"
        v-if="view == 'access'"
      >
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

        <div class="text-italic q-pb-lg">
          <span class="float-right"
            >Required <span class="text-red text-bold">*</span></span
          >
        </div>

        <q-input
          label="Username"
          v-model="username"
          required
          autocomplete="username"
        ></q-input>

        <q-input
          label="Password"
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          required
          autocomplete="new-password"
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
            autocomplete="new-password"
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
              authTab == 'signup' &&
              password &&
              password2 &&
              !passwordConfirmed()
            "
          >
            The passwords must match
          </div>

          <q-input
            label="Email"
            v-model="email"
            type="email"
            required
          ></q-input>
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

        <q-input
          label="Username"
          v-model="username"
          autocomplete="username"
        ></q-input>
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
          autocomplete="new-password"
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
          autocomplete="new-password"
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
          autocomplete="new-password"
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
          autocomplete="new-password"
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

      <template v-if="view == 'confirmSignUp'">
        <template v-if="confirmStage == 'enterCode'">
          <q-card-section class="text-center justify-center">
            <div v-if="userStore.username" class="text-h4">
              Your confirmation code is on the way.
            </div>
            <div v-else class="text-h4">Confirm Sign Up</div>
          </q-card-section>
          <q-card-section class="text-center justify-center">
            <div v-if="userStore.username" class="q-mx-md q-mb-lg text-body1">
              A confirmation code has been sent to
              {{ obscureEmail(userStore.email) }}
            </div>
            <div v-else class="q-mx-md q-mb-lg text-body1">
              Enter the confirmation code provided via email and the username
              you chose during sign up.
            </div>
            <q-input
              v-if="!userStore.username"
              label="Username"
              v-model="username"
              required
              autocomplete="username"
            ></q-input>
            <q-input
              label="Confirmation Code"
              v-model="confirmCode"
              required
            ></q-input>
          </q-card-section>
        </template>
      </template>

      <div class="row col-12" v-if="errors.length > 0">
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

      <q-card-actions class="text-center justify-center">
        <div v-if="view == 'access'">
          <q-tab-panels v-model="authTab" animated>
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
                  :disable="!validToSignIn"
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
        </div>

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
        <div v-if="view == 'confirmSignUp'">
          <div class="row col-12 justify-center text-center">
            <q-btn
              class="q-mt-sm bg-primary on-primary"
              @click="platformConfirmSignUp()"
              >Confirm Account</q-btn
            >
          </div>
          <div>
            <q-btn
              class="q-my-lg text-card-subdued text-body1"
              flat
              no-caps
              @click="resendSignUpCode()"
              >Resend Code</q-btn
            >
          </div>
        </div>
      </q-card-actions>
    </form>
  </q-card>
</template>

<script  setup>
const props = defineProps({
  view: String,
});

const emit = defineEmits(["notification"]);

import { useRouter } from "vue-router";
const router = useRouter();

import { ref, computed } from "vue";

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
  confirmSignUp,
  resendConfirmationCode,
  obscureEmail,
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
const confirmCode = ref(null);

const resetStage = ref("enterUsername");
const confirmStage = ref("enterCode");

const platformSignIn = async () => {
  try {
    flushErrors();
    const user = await signIn(username.value, password.value);
    router.push("/user/dashboard");
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const sendResetCode = async () => {
  console.log("Sending reset code");
  try {
    flushErrors();
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
    flushErrors();
    await submitResetCode(userStore.username, resetCode.value, password.value);
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const changePlatformPassword = async () => {
  console.log("Changing password");
  try {
    flushErrors();
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
    flushErrors();
    if (password.value != password2.value) {
      throw "Passwords much match.";
    }
    const userObj = {
      username: username.value,
      password: password.value,
      email: email.value, // optional
      telephone: "+" + telephone.value.replace(/\D/g, ""), // optional - E.164 number convention
      commonName: commonName.value, // optional
    };
    await signUp(userObj);
    // router.push("/auth/signup/confirm");
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const resendSignUpCode = async () => {
  try {
    flushErrors();
    const confirmUser = username.value ? username : userStore.username;
    const result = await resendConfirmationCode(confirmUser);
    if (result) {
      emit(
        "notification",
        "The confirmation code has been sent to the email address you used when signing up. It should arrive within minutes."
      );
    }
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const platformConfirmSignUp = async () => {
  try {
    flushErrors();
    const confirmUser = username.value ? username.value : userStore.username;
    console.log("CONFIRM USER: " + confirmUser);
    const result = await confirmSignUp(confirmUser, confirmCode.value);
    router.push("/auth/login");
  } catch (e) {
    console.error(e);
    errors.value = [e];
  }
};

const flushErrors = () => {
  errors.value = [];
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

const validToSignIn = computed(() => {
  return validatePassword(password.value) &&
    username.value &&
    username.value.length > 0
    ? true
    : false;
});
</script>

<style lang="sass">
.q-field__native[required] ~ .q-field__label:after
  content: '*'
  color: red
</style>
