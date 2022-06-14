<template>
  <div class="row col-12">
    <div>Multicorder</div>
    <video
      ref="video"
      :width="width"
      :height="height"
      :src="videoSource"
      :autoplay="autoplay"
      :playsInline="playsInline"
      muted="recorderMuted"
    />
    <canvas id="canvas"> </canvas>
    <div>
      <img
        v-show="view == 'snapshot'"
        :src="snapshot"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
console.log("MultiCorder.vue - loading");

import useMultiCorder from "./useMultiCorder";

export default defineComponent({
  name: "MultiCorder",
  emits: ["error", "notification"],
  props: {
    videoSource: {
      type: Object,
      default: null,
    },
    width: {
      type: [Number, String],
      default: "100%",
    },
    height: {
      type: [Number, String],
      default: "100%",
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    playsInline: {
      type: Boolean,
      default: true,
    },
    recorderMuted: {
      type: Boolean,
      default: true,
    },
    playerMuted: {
      type: Boolean,
      default: true,
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg",
    },
    videoTypes: {
      type: Array,
      default: () => {
        return ["camera", "screen"];
      },
    },
    recorderMode: {
      type: String,
      default: "single",
    },
    camerasHeader: {
      type: Array,
      default: () => {
        return [
          {
            divider: true,
            header: "Cameras",
          },
        ];
      },
    },
    staticVideoOptions: {
      type: Array,
      default: () => {
        return [
          {
            text: "Screen share",
            value: "screenshare",
          },
        ];
      },
    },
    staticVideoOptionsHeader: {
      type: Array,
      default: () => {
        return [
          {
            divider: true,
            header: "Screen Sharing",
          },
        ];
      },
    },
  },
  setup(props, { emit }) {
    console.log(props);

    const { initVideoOptions, snapshot } = useMultiCorder();

    const view = ref("camera");

    onMounted(() => {
      initVideoOptions();
    });

    return {
      snapshot, // All the captured image to be displayed or manipulated
      view, // The current selected view
    };
  },
});
</script>
