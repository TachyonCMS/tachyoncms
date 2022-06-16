<template>
  <div class="row col-12 text-center justify-center items-center">
    <div class="row col-12 text-center justify-center items-center">
      <h6>Select Video Source</h6>
    </div>

    <div class="row col-8 text-center justify-center items-center">
      <q-btn-dropdown color="primary" icon="mdi-camera" label="Camera">
        <q-list>
          <q-item
            v-for="item in videoSourceList"
            :key="item.value"
            clickable
            v-close-popup
            @click="selectedVideoSource = item"
          >
            <q-item-section>
              <q-item-label>{{ item.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="row col-8 text-center justify-center items-center q-mt-sm">
      - or -
    </div>

    <div class="row col-8 text-center justify-center items-center">
      <q-btn
        @click="
          selectedVideoSource = { text: 'Screen Capture', value: 'screen' }
        "
        class="option-btn"
        icon="mdi-monitor"
        flat
        size="md"
        label="Screen Capture"
        :data-cy="dataCySlug + '-screen-capture-btn'"
      ></q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  name: "VideoSourceSelector",
  props: ["videoSourceList", "dataCySlug"],
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

<style scoped>
h6 {
  margin: 0 0 1em 0;
}
</style>
