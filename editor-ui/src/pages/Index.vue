<template>
  <q-page class="flex flex-center">
    <q-card flat class="text-center"> Welcome to TachyonCMS </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import LinkButton from "../components/site/buttons/Link.vue";

export default defineComponent({
  name: "PageIndex",

  setup() {},

  components: {
    //    LinkButton,
  },
});
</script>
