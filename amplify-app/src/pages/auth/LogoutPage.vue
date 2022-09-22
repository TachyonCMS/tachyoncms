<template>
  <q-page padding class="auth bg-card-surround">
    You have been logged out
  </q-page>
</template>

<script setup>
import { computed } from "vue";
import useAuth from "../../composables/useAuth";
const { signOut } = useAuth();
signOut();
</script>

<style scoped>
.auth {
  margin: 0 auto;
  min-width: 300px;
  max-width: 500px;
}
</style>
