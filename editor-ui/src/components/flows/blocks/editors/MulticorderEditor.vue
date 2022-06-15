<template>
  <div class="row col-12">
    <div>MulticorderEditor</div>
    <div class="row window-width justify-center items-center">
      <multi-corder
        :width="width"
        :height="height"
        :videoTypes="['camera']"
      ></multi-corder>
    </div>
  </div>
</template>

<script>
console.log("MulticorderEditor.vue - loading");
import { defineComponent, ref, computed } from "vue";

import MultiCorder from "../../asset-manager/MultiCorder";

export default defineComponent({
  name: "MultiCorderEditor",
  props: ["data", "dataCySlug"],
  components: {
    MultiCorder,
  },
  setup(props) {
    const width = ref(360);
    const height = computed(() => {
      return width.value / 1.778;
    });
    return {
      height,
      width,
    };
  },
});
</script>

<style scoped>
.videobox {
  background-color: black;
}
</style>
