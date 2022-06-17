<template>
  <div class="flex flex-center">
    <div
      v-show="view != 'selectSource'"
      class="row col-12"
      :style="'width=: ' + vWidth + 'px'"
    >
      <div
        class="flex videobox fit row wrap justify-around items-start content-start"
      >
        <q-resize-observer @resize="onResize"></q-resize-observer>
        <div class="relative-position">
          <video
            :ref="videoId"
            :src="videoSource"
            :autoplay="autoplay"
            :playsInline="playsInline"
            :width="vWidth"
            :height="vHeight"
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
      </div>
      <div>
        <img
          v-show="view == 'snapshot'"
          :src="snapshot"
          width="100%"
          height="100%"
        />
      </div>
      <div v-show="view != 'selectSource'" class="row col-12 video-controls">
        <q-btn
          round
          icon="mdi-camera-iris"
          v-show="recorderState != 'stopped'"
          class="video-control-btn"
          @click="onSnap()"
        ></q-btn>
        <q-btn
          round
          icon="mdi-play"
          v-show="recorderState === 'stopped'"
          @click="this.recorderState = 'playing'"
          class="video-control-btn"
        ></q-btn>

        <q-space></q-space>

        <q-btn
          round
          icon="mdi-record"
          text-color="red"
          v-show="['idle', 'paused'].includes(recorderState)"
          @click="this.recorderState = 'recording'"
          class="video-control-btn"
        ></q-btn>

        <q-btn
          round
          icon="mdi-pause"
          v-show="recorderState === 'recording'"
          @click="this.recorderState = 'paused'"
          class="video-control-btn"
        ></q-btn>

        <q-btn
          round
          icon="mdi-stop"
          v-show="['recording', 'paused'].includes(recorderState)"
          @click="this.recorderState = 'stopped'"
          class="video-control-btn"
        ></q-btn>

        <q-btn
          round
          icon="mdi-content-save"
          v-show="recorderState === 'stopped'"
          @click="this.recorderState = 'saving'"
          class="video-control-btn"
        ></q-btn>
        <q-btn
          round
          icon="mdi-download"
          v-show="recorderState === 'stopped'"
          @click="this.recorderState = 'downloading'"
          class="video-control-btn"
        ></q-btn>

        <q-space></q-space>
        <div v-show="recorderState != 'stopped'">
          <q-btn
            round
            icon="mdi-microphone"
            v-show="micOn"
            @click="micOn = false"
            class="video-control-btn"
          ></q-btn>
          <q-btn
            round
            icon="mdi-microphone-off"
            v-show="!micOn"
            @click="this.micOn = true"
            class="video-control-btn"
          ></q-btn>
          <q-btn
            round
            icon="mdi-volume-high"
            v-show="!muted"
            @click="muted = true"
            class="video-control-btn"
          ></q-btn>
          <q-btn
            round
            icon="mdi-volume-off"
            v-show="muted"
            @click="muted = false"
            class="video-control-btn"
          ></q-btn>
        </div>
        <q-btn
          round
          icon="mdi-delete"
          v-show="recorderState === 'stopped'"
          @click="this.recorderState = 'idle'"
          class="video-control-btn"
        ></q-btn>
      </div>
    </div>

    <div
      v-show="view === 'selectSource'"
      :style="'min-height: ' + vHeight + 'px'"
      class="flex flex-center"
    >
      <video-source-selector
        :videoSourceList="cameras"
        @selectedSource="(event) => onChangeVideoSource(event)"
      ></video-source-selector>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";

import { useQuasar } from "quasar";

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
      type: [Number, String, null],
      default: null,
    },
    height: {
      type: [Number, String, null],
      default: null,
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
    snapshotFormat: {
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

    const $q = useQuasar();

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
      cameraRes,
    } = useMultiCorder();

    const view = ref("selectSource");

    const snapshot = ref(null);

    const sourceName = ref(null);

    onMounted(() => {
      initVideoOptions(props.videoTypes);
    });

    const videoId = "video_" + props.uniq;
    let resized = ref(false);

    // Video height and width
    let widthOverride = false;
    const vWidth = computed(() => {
      let targetWidth = props.width ? props.width : cameraRes.width;

      const hwWidth = $q.screen.width;
      if (targetWidth > hwWidth) {
        targetWidth = hwWidth * 0.9;
        widthOverride = true;
      }
      return targetWidth;
    });
    const vHeight = computed(() => {
      let targetHeight = props.height ? props.height : cameraRes.height;
      if (widthOverride || resized) {
        targetHeight = vWidth.value * 0.75;
      }
      return targetHeight;
    });

    // We only carer about the event, not the content of the resize event.
    const onResize = (size) => {
      //report.value = size;
      resized.value = true; // Trigger a vHeight recalculation
      resized.value = false;
    };

    // Used during screen resize
    const report = ref(null);

    // The resolved video element
    const videoElem = ref(null);

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
      vWidth,
      vHeight,
      onResize,
    };
  },
  methods: {
    onChangeVideoSource(videoSource) {
      console.log(videoSource);
      let videoElem;
      videoElem = this.$refs[this.videoId];
      this.videoElem = videoElem;
      this.changeVideoSource(videoSource.value, videoElem);
      this.sourceName = videoSource.text;
      this.view = "video";
    },
    onCloseVideo() {
      const videoElem = this.$refs[this.videoId];
      this.stopVideo(this.videoElem);
      console.log(this.sourceName);
      this.sourceName = null;
      //this.selectedVideoSource = null;
      this.view = "selectSource";
    },
    onSnap() {
      console.log("SNAP!");
    },
  },
});
</script>

<style scoped>
.videobox {
  background-color: black;
}
.video-controls {
  background-color: #e8e8e8;
}
.video-control-btn {
  background-color: #f8f8f8;
}
</style>
