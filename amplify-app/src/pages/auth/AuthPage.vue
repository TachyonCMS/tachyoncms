<template>
  <q-page padding class="auth bg-card-surround">
    <!-- <authenticator></authenticator> -->
    <AuthComponent></AuthComponent>
  </q-page>
</template>

<script setup>
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import AuthComponent from "../../components/AuthComponent.vue";
</script>

<style scoped>
.auth {
  margin: 0 auto;
  min-width: 300px;
  max-width: 500px;
}
</style>
