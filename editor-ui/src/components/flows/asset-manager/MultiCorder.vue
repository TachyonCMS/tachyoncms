<template>
  <div class="row col-12 text-center justify-center items-center">
    <div class="videobox" v-show="view != 'selectSource'">
      <video
        :ref="'video_' + uniq"
        :src="videoSource"
        :autoplay="autoplay"
        :playsInline="playsInline"
        :height="height"
        :width="width"
        muted="recorderMuted"
      />
      <div>
        <img
          v-show="view == 'snapshot'"
          :src="snapshot"
          width="100%"
          height="100%"
        />
      </div>
    </div>

    <div
      class="col-12 text-center justify-center items-center"
      v-show="view === 'selectSource'"
    >
      <video-source-selector
        :videoSourceList="cameras"
        @selectedSource="(event) => onChangeVideoSource(event, 'video_' + uniq)"
      ></video-source-selector>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
console.log("MultiCorder.vue - loading");

import useMultiCorder from "./useMultiCorder";

import VideoSourceSelector from "./components/VideoSourceSelector.vue";

export default defineComponent({
  name: "MultiCorder",
  emits: ["error", "notification"],
  props: {
    uniq: {
      type: String,
      default: "0",
    },
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
  },
  components: {
    VideoSourceSelector,
  },
  setup(props, { emit }) {
    console.log(props);

    const { initVideoOptions, cameras, startScreenshare, changeVideoSource } =
      useMultiCorder();

    const view = ref("selectSource");

    const snapshot = ref(null);

    onMounted(() => {
      initVideoOptions(props.videoTypes);
    });

    return {
      snapshot, // All the captured image to be displayed or manipulated
      view, // The current selected view
      cameras, // List of source options
      startScreenshare,
      changeVideoSource,
    };
  },
  methods: {
    onChangeVideoSource(videoSource, videoElemName) {
      const videoElem = this.$refs[videoElemName];
      this.changeVideoSource(videoSource, videoElem);
      this.view = "video";
    },
  },
});
</script>

<style scoped>
.videobox {
  background-color: black;
}
</style>
