<template>
  <no-flow-source-set-page></no-flow-source-set-page>
</template>

<script>
import { defineComponent } from "vue";

import NoFlowSourceSetPage from "../pages/flows/NoFlowSourceSetPage";

export default defineComponent({
  name: "PageIndex",
  components: {
    NoFlowSourceSetPage,
  },

  setup() {},
});
</script>
