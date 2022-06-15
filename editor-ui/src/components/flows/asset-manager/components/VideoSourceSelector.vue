<template>
  <div class="row col-8 text-center justify-center items-center">
    <q-select
      v-model="selectedVideoSource"
      :options="videoSourceList"
      option-label="text"
      label="Camera"
      emit-value
      map-options
      class="col-xs-8 col-sm-4 col-md-2 q-gutter-xs"
    ></q-select>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  name: "VideoSourceSelector",
  props: ["videoSourceList"],
  emits: ["selectedSource"],
  setup(props, { emit }) {
    console.log(props);

    const selectedVideoSource = ref(null);

    watch(selectedVideoSource, (currentValue, oldValue) => {
      if (currentValue != oldValue) {
        emit("selectedSource", currentValue);
      }
    });

    const width = ref(0);

    return {
      selectedVideoSource,
      width,
    };
  },
});
</script>
