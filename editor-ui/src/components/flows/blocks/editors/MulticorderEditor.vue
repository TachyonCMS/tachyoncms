<template>
  <div class="row col-12">
    <div>MulticorderEditor</div>
    <am-camera></am-camera>
  </div>
</template>

<script>
console.log("MulticorderEditor.vue - loading");
import { defineComponent, ref } from "vue";

import AmCamera from "../../asset-manager/AMCamera";

export default defineComponent({
  name: "MulticorderEditor",
  props: ["data", "dataCySlug"],
  components: {
    AmCamera,
  },
  setup(props) {},
});
</script>
