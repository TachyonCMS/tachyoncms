<template>
  <div class="row col-12">{{ videoSourceList }}</div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "VideoSourceSelector",
  props: ["videoSourceList"],
  emits: ["selectedSource"],
  setup(props) {
    console.log(props);
    return {};
  },
});
</script>
