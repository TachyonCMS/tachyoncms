<template>
  <div class="flex fit">
    <div
      class="flex fit"
      v-if="videoTypes.length <= 1 && videoTypes[0] == 'camera'"
    >
      <div
        class="fit row col-12 text-center justify-center items-center"
        height="500px"
      >
        <q-list bordered separator style="background-color: white">
          <q-item
            v-for="item in videoSourceList"
            :key="item.value"
            clickable
            v-close-popup
            @click="this.$emit('selectedSource', item)"
          >
            <q-item-section>
              <q-item-label>{{ item.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="flex fit" v-if="videoTypes[0] == 'screen'">
      <div
        class="fit row col-12 text-center justify-center items-center"
        height="500px"
      >
        <q-btn
          clickable
          v-close-popup
          @click="
            this.$emit('selectedSource', {
              text: 'Screen Capture',
              value: 'screen',
            })
          "
          class="btn"
          >Select Screen</q-btn
        >
      </div>
    </div>
    <div class="flex fit" v-if="videoTypes.length > 1">
      <div class="fit row col-12 text-center justify-center items-center">
        <h6>Multimedia Source</h6>
      </div>
      <div
        class="fit row col-12 text-center justify-center items-center"
        height="500px"
      >
        <q-btn-dropdown color="primary" icon="mdi-camera" label="Camera">
          <q-list>
            <q-item
              v-for="item in videoSourceList"
              :key="item.value"
              clickable
              v-close-popup
              @click="this.$emit('selectedSource', item)"
            >
              <q-item-section>
                <q-item-label>{{ item.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div
        class="fit row col-12 text-center justify-center items-center q-mt-sm"
      >
        - or -
      </div>

      <div class="fit row col-12 text-center justify-center items-center">
        <q-btn
          @click="
            this.$emit('selectedSource', {
              text: 'Screen Capture',
              value: 'screen',
            })
          "
          class="option-btn"
          icon="mdi-monitor"
          flat
          size="md"
          label="Screen Capture"
          :data-cy="dataCySlug + '-screen-capture-btn'"
        ></q-btn>
      </div>

      <div
        class="fit row col-12 text-center justify-center items-center q-mt-sm"
      >
        - or -
      </div>

      <div class="fit row col-12 text-center justify-center items-center">
        <q-btn
          @click="
            this.$emit('selectedSource', {
              text: 'Whiteboard',
              value: 'whiteboard',
            })
          "
          class="option-btn"
          icon="mdi-drawing-box"
          flat
          size="md"
          label="Whiteboard (Coming Soon!)"
          :data-cy="dataCySlug + '-whiteboard-btn'"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  name: "VideoSourceSelector",
  props: ["videoSourceList", "dataCySlug", "videoTypes"],
  emits: ["selectedSource"],
  setup(props, { emit }) {
    console.log(props);

    const width = ref(0);

    return {
      width,
    };
  },
});
</script>

<style scoped>
h6 {
  margin: 0 0 1em 0;
}
.btn {
  background-color: white;
}
</style>