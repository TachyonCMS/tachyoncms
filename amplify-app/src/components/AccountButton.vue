<template>
  <q-btn-dropdown
    dropdown-icon="mdi-account-circle"
    size="md"
    class="q-px-sm"
    :label="userStore.authenticated ? userStore.username : ''"
  >
    <q-list bordered padding dense>
      <q-item-label header>{{ $t("Account") }}</q-item-label>

      <template v-if="userStore.isSignedIn()">
        <q-item>
          <q-item-section class="text-no-wrap">{{
            $t("Profile")
          }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-no-wrap">{{
            $t("Password")
          }}</q-item-section>
        </q-item>
        <q-item clickable @click="platformSignOut()">
          <q-item-section class="text-no-wrap">{{
            $t("Logout")
          }}</q-item-section>
        </q-item>
      </template>
      <template v-else>
        <q-item clickable v-close-popup to="/auth/login">
          <q-item-section class="text-no-wrap">{{
            $t("Login")
          }}</q-item-section>
        </q-item>
        <q-item clickable v-close-popup to="/auth/signup">
          <q-item-section class="text-no-wrap">{{
            $t("New account")
          }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-btn-dropdown>
</template>

<script  setup>
import { ref, computed } from "vue";

// USER Store - info about the auth user
import { useUserStore } from "../stores/user";
const userStore = useUserStore();

//import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
//const auth = useAuthenticator();

import useAuth from "../composables/useAuth";
const { signOut } = useAuth();

const platformSignOut = async () => {
  console.log("LOGOUT");
  await signOut();
};
</script>

<style lang="scss">
</style>
