<template>
  <div class="row col-12">
    <am-camera></am-camera>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import AmCamera from "../../asset-manager/AMCamera";

export default defineComponent({
  name: "MulticorderEditor",
  props: ["data", "dataCySlug"],
  components: {
    AmCamera,
  },
  setup(props) {
    console.log("Multicorder Capture");
  },
});
</script>
