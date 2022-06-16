<template>
  <div class="flex flex-center">
    <div v-show="view != 'selectSource'" class="row col-12">
      <div class="videobox">
        <video
          :ref="videoId"
          :src="videoSource"
          :autoplay="autoplay"
          :playsInline="playsInline"
          :height="height"
          :width="width"
          muted="recorderMuted"
        />
        <div class="top-right text-body2">
          {{ sourceName }}
          <q-icon
            name="mdi-close-circle"
            @click="this.onCloseVideo(videoId)"
          ></q-icon>
        </div>
      </div>
      <div>
        <img
          v-show="view == 'snapshot'"
          :src="snapshot"
          width="100%"
          height="100%"
        />
      </div>
    </div>

    <div v-show="view != 'selectSource'" class="row col-12">
      <q-btn round icon="mdi-camera-iris"></q-btn>

      <q-space></q-space>

      <q-btn
        round
        icon="mdi-record"
        text-color="red"
        v-show="['idle', 'paused'].includes(recorderState)"
        @click="this.recorderState = 'recording'"
      ></q-btn>

      <q-btn
        round
        icon="mdi-pause"
        v-show="recorderState === 'recording'"
        @click="this.recorderState = 'paused'"
      ></q-btn>

      <q-btn
        round
        icon="mdi-stop"
        v-show="['recording', 'paused'].includes(recorderState)"
        @click="this.recorderState = 'stopped'"
      ></q-btn>

      <q-btn
        round
        icon="mdi-play"
        v-show="recorderState === 'stopped'"
        @click="this.recorderState = 'playing'"
      ></q-btn>
      <q-btn
        round
        icon="mdi-content-save"
        v-show="recorderState === 'stopped'"
        @click="this.recorderState = 'saving'"
      ></q-btn>
      <q-btn
        round
        icon="mdi-download"
        v-show="recorderState === 'stopped'"
        @click="this.recorderState = 'downloading'"
      ></q-btn>
      <q-btn
        round
        icon="mdi-delete"
        v-show="recorderState === 'stopped'"
        @click="this.recorderState = 'deleting'"
      ></q-btn>

      <q-space></q-space>

      <q-btn
        round
        icon="mdi-microphone"
        v-show="micOn"
        @click="micOn = false"
      ></q-btn>
      <q-btn
        round
        icon="mdi-microphone-off"
        v-show="!micOn"
        @click="this.micOn = true"
      ></q-btn>
      <q-btn
        round
        icon="mdi-volume-high"
        v-show="!muted"
        @click="muted = true"
      ></q-btn>
      <q-btn
        round
        icon="mdi-volume-off"
        v-show="muted"
        @click="muted = false"
      ></q-btn>
    </div>

    <div v-show="view === 'selectSource'" class="row">
      <video-source-selector
        :videoSourceList="cameras"
        @selectedSource="(event) => onChangeVideoSource(event)"
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

    const {
      initVideoOptions,
      cameras,
      startScreenshare,
      changeVideoSource,
      stopVideo,
      micOn,
      videoLive,
      recording,
      paused,
      muted,
      recorderState,
    } = useMultiCorder();

    const view = ref("selectSource");

    const snapshot = ref(null);

    const sourceName = ref(null);

    onMounted(() => {
      initVideoOptions(props.videoTypes);
    });

    const videoId = "video_" + props.uniq;

    return {
      snapshot, // All the captured image to be displayed or manipulated
      view, // The current selected view
      cameras, // List of source options
      startScreenshare,
      changeVideoSource,
      sourceName,
      stopVideo,
      videoId,
      micOn,
      videoLive,
      recording,
      paused,
      muted,
      recorderState,
    };
  },
  methods: {
    onChangeVideoSource(videoSource) {
      const videoElem = this.$refs[this.videoId];
      this.changeVideoSource(videoSource.value, videoElem);
      this.sourceName = videoSource.text;
      this.view = "video";
    },
    onCloseVideo() {
      const videoElem = this.$refs[this.videoId];
      this.stopVideo(videoElem);
      this.sourceName = null;
      this.view = "selectSource";
    },
  },
});
</script>

<style scoped>
.videobox {
  background-color: black;
}
</style>
