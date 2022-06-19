<template>
  <div
    class="fit row wrap justify-around items-start content-start relative-position"
  >
    <div>
      <multi-corder :width="width" :videoTypes="['camera']"></multi-corder>
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
    const width = ref(2500);
    const height = computed(() => {
      return width.value * 0.75; //1.778;
    });

    return {
      height,
      width,
    };
  },
});
</script>

<style scoped>
.mce {
  background-color: gray;
}
.video-controls {
  background-color: platinum;
}
</style>
