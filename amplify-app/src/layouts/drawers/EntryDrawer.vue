<template>
  <q-list>
    <q-item-label header class="on-drawer-paper"> Join Now! </q-item-label>

    <EssentialLink
      v-for="link in essentialLinks"
      :key="link.title"
      v-bind="link"
    />
  </q-list>
</template>

<script setup>
import EssentialLink from "components/EssentialLink.vue";

const essentialLinks = [
  {
    title: "Signup Now",
    caption: "or Signin",
    icon: "mdi-login",
    link: "/",
  },
];
</script>
