<template>
  <div class="row col-12">
    <q-select
      v-model="selectedVideoSource"
      :options="videoSourceList"
      option-label="text"
      label="Video devices"
      emit-value
      map-options
    ></q-select>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "VideoSourceSelector",
  props: ["videoSourceList"],
  emits: ["selectedSource"],
  setup(props) {
    console.log(props);

    const selectedVideoSource = ref(null);

    return {
      selectedVideoSource,
    };
  },
});
</script>
