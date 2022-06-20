<template>
  <div class="flex flex-center text-center justify-center">
    {{ recorderState }}
    <q-resize-observer @resize="onResize" debounce="100"></q-resize-observer>
    <div class="row col-12">
      <div
        class="block videobox row wrap justify-around items-start content-start"
      >
        <div>
          <div class="relative-position nospc">
            <video
              v-show="['video'].includes(view)"
              :ref="videoId"
              :src="videoSource"
              :autoplay="autoplay"
              :playsInline="playsInline"
              :width="vWidth"
              :height="vHeight"
              muted="recorderMuted"
            />
            <div v-show="['video'].includes(view)" class="top-right text-body2">
              {{ videoSourceName }}
              <q-icon
                name="mdi-close-circle"
                @click="this.onCloseVideo()"
              ></q-icon>
            </div>
          </div>

          <div v-show="view == 'snapshot'">
            <canvas :ref="canvasId" :width="vWidth" :height="vHeight">
              <img
                :ref="imgId"
                :src="snapshotImgUrl"
                :width="vWidth"
                :height="vHeight"
              />
            </canvas>
          </div>

          <!-- SNAPSHOT CONTROLS -->

          <div v-show="view == 'snapshot'" class="row col-12 video-controls">
            <q-space></q-space>
            <q-btn
              round
              icon="mdi-download"
              class="video-control-btn"
              @click="onSnapDownload()"
            ></q-btn>
            <q-btn
              round
              icon="mdi-content-save"
              class="video-control-btn"
              @click="onSnapSave()"
            ></q-btn>

            <q-space></q-space>

            <q-btn
              round
              flat
              icon="mdi-delete"
              class="video-control-btn"
              @click="onSnapDelete()"
            ></q-btn>
          </div>

          <!-- VIDEO CONTROLS -->

          <div v-show="view == 'video'" class="row col-12 video-controls">
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
              @click="this.onResume()"
              class="video-control-btn"
            ></q-btn>

            <q-space></q-space>

            <q-btn
              round
              icon="mdi-record"
              text-color="red"
              v-show="['streaming'].includes(recorderState)"
              @click="this.onRecord()"
              class="video-control-btn"
            ></q-btn>

            <q-btn
              round
              icon="mdi-record"
              text-color="red"
              v-show="['paused'].includes(recorderState)"
              @click="this.onRecordResume()"
              class="video-control-btn"
            ></q-btn>

            <q-btn
              round
              icon="mdi-pause"
              v-show="this.recorderState === 'recording'"
              @click="this.onRecordPause()"
              class="video-control-btn"
            ></q-btn>

            <q-btn
              round
              icon="mdi-stop"
              v-show="['recording', 'paused'].includes(this.recorderState)"
              @click="this.onRecordStop()"
              class="video-control-btn"
            ></q-btn>

            <q-btn
              round
              icon="mdi-download"
              v-show="recorderState === 'stopped'"
              @click="this.onRecordDownload()"
              class="video-control-btn"
            ></q-btn>
            <q-btn
              round
              icon="mdi-content-save"
              v-show="recorderState === 'stopped'"
              @click="this.onRecordSave()"
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
              @click="this.onRecordDelete()"
              class="video-control-btn"
            ></q-btn>
          </div>
          <!--
          <div class="col-12">
            Calculated Width: {{ vWidth }} Calculated Height: {{ vHeight }}
          </div>
          -->
        </div>
      </div>
    </div>
    <div v-show="view == 'whiteboard'">
      <white-board :width="vWidth" :height="vHeight"></white-board>
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
import WhiteBoard from "./components/ImgCanvas.vue";

export default defineComponent({
  name: "MultiCorder",
  emits: ["error", "notification", "new-recording"],
  props: {
    nuggetId: {
      type: String,
      default: "0",
    },
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
      default: 0,
    },
    height: {
      type: [Number, String],
      default: 0,
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
    WhiteBoard,
  },
  setup(props, { emit }) {
    console.log(props);

    const $q = useQuasar();

    const {
      initVideoOptions,
      cameras,
      startScreenshare,
      changeVideoSource,
      closeVideoSource,
      micOn,
      videoLive,
      recording,
      paused,
      muted,
      recorderState,
      getMediaName,
      snapshotImgUrl,
      snapshotName,
      snapshotExt,
      snapshotFullname,
      videoSourceName,
      videoElem,
      canvasElem,
      imgElem,
      videoSnapshot,
      downloadSnapshot,
      saveNuggetMedia,
      recordStart,
      recordPause,
      recordResume,
      recordStop,
      recordDelete,
      recordDownload,
      recordSave,
    } = useMultiCorder();

    const view = ref("selectSource");

    const showSnapshot = ref(false);

    onMounted(() => {
      initVideoOptions(props.videoTypes);
    });

    const videoId = "video_" + props.uniq;
    const canvasId = "canvas_" + props.uniq;
    const imgId = "img_" + props.uniq;

    const viewWidth = ref(0);

    const calcWidth = () => {
      let targetWidth;

      // Get the available width as reported by Quasar
      // This isn't hardware width, but browser window width.
      viewWidth.value = $q.screen.width;

      targetWidth =
        props.width < viewWidth.value * 0.95
          ? props.width
          : viewWidth.value * 0.95;
      console.log(targetWidth);

      return targetWidth;
    };

    const vWidth = computed(() => {
      return calcWidth();
    });

    const vHeight = computed(() => {
      return vWidth.value * 0.562;
    });

    const onResize = (size) => {
      console.log(size);
      // vWidth.value = calcWidth();
    };

    // Set view, logic can be enforced here
    const setView = (newView) => {
      console.log("setting view to " + newView);
      view.value = newView;
    };

    // The recorder instance
    const recorder = ref(null);

    // The recorder mode for number of segments single|multi
    const recorderMode = ref("single");

    return {
      snapshotImgUrl, // All the captured image to be displayed or manipulated
      view, // The current selected view
      cameras, // List of source options
      startScreenshare,
      changeVideoSource,
      videoSourceName,
      closeVideoSource,
      videoId,
      canvasId,
      imgId,
      micOn,
      videoLive,
      recording,
      paused,
      muted,
      recorderState,
      vWidth,
      vHeight,
      onResize,
      videoElem,
      canvasElem,
      imgElem,
      showSnapshot,
      snapshotName,
      snapshotExt,
      saveNuggetMedia,
      getMediaName,
      setView,
      videoSnapshot,
      downloadSnapshot,
      recordStart,
      recordPause,
      recordResume,
      recordStop,
      recordDelete,
      recordDownload,
      recordSave,
    };
  },
  methods: {
    onChangeVideoSource(videoSource) {
      if (videoSource.value === "whiteboard") {
        this.setView("whiteboard");
      } else {
        let videoElem;
        videoElem = this.$refs[this.videoId];
        this.videoElem = videoElem;
        let canvasElem;
        canvasElem = this.$refs[this.canvasId];
        this.canvasElem = canvasElem;
        let imgElem;
        imgElem = this.$refs[this.imgId];
        this.imgElem = imgElem;
        this.changeVideoSource(
          videoSource.value,
          videoElem,
          canvasElem,
          imgElem
        );
        this.videoSourceName = videoSource.text;
        this.setView("video");
      }
    },
    onCloseVideo() {
      this.closeVideoSource();
      this.videoSourceName = null;
      this.setView("selectSource");
    },
    onSnap() {
      this.videoSnapshot(this.vWidth, this.vHeight);
      this.setView("snapshot");
    },
    onSnapDelete() {
      this.snapshot = null;
      this.setView("video");
    },
    async onSnapDownload() {
      this.downloadSnapshot();
    },
    async onSnapSave() {
      this.onSnapDelete();
    },
    onRecord() {
      console.log("MC - onRecord");

      this.recordStart();
    },

    onRecordPause() {
      console.log("MC - onRecordPause");
      this.recordPause();
    },

    onRecordResume() {
      console.log("MC - onRecordResume");

      this.recordResume();
    },

    onRecordStop() {
      console.log("MC - onRecordStop");

      this.recordStop();
    },

    onRecordDelete() {
      console.log("MC - onRecordDelete");

      this.recordDelete();
    },

    onRecordDownload() {
      console.log("MC - onRecordDownload");

      this.recordDownload();
    },

    onRecordSave() {
      console.log("MC - onRecordSave");

      this.recordSave(this.nuggetId);
    },
  },
});
</script>

<style scoped>
.videobox {
  background-color: #e8e8e8;
}
.video-controls {
  background-color: #e8e8e8;
}
.video-control-btn {
  background-color: #f8f8f8;
}

.nospc {
  padding: 0;
  margin: 0;
}
</style>
