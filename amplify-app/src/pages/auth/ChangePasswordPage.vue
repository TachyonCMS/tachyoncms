<template>
  <q-page padding class="auth bg-card-surround">
    <AuthComponent view="changePassword"></AuthComponent>
  </q-page>
</template>

<script setup>
import { computed } from "vue";

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
