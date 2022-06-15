<template>
  <div class="row col-12">
    <div>MulticorderEditor</div>
    <multi-corder></multi-corder>
  </div>
</template>

<script>
console.log("MulticorderEditor.vue - loading");
import { defineComponent, ref } from "vue";

import MultiCorder from "../../asset-manager/MultiCorder";

export default defineComponent({
  name: "MultiCorderEditor",
  props: ["data", "dataCySlug"],
  components: {
    MultiCorder,
  },
  setup(props) {},
});
</script>
