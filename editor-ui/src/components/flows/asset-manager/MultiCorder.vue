<template>
  <div class="flex full-width nospc">
    <div class="fit videobox block relative-postion nospc">
      <q-resize-observer @resize="onResize" debounce="200"></q-resize-observer>

      <div class="relative-position nospc ofh">
        <video
          v-show="['video'].includes(view)"
          :ref="videoId"
          :src="videoSource"
          :autoplay="autoplay"
          :playsInline="playsInline"
          :width="vWidth"
          muted="recorderMuted"
          @loadedmetadata="getVideoDimensions"
        />
        <div v-show="['video'].includes(view)" class="top-right text-body2">
          {{ videoSourceName }}
          <q-icon name="mdi-close-circle" @click="this.onCloseVideo()"></q-icon>
        </div>
        <div
          v-show="showSnapMeta"
          class="top-left full-width z-max"
          style="opacity: 100"
        >
          <q-card flat>
            <q-toolbar>
              <q-avatar>
                <q-icon name="mdi-information"></q-icon>
              </q-avatar>

              <q-toolbar-title
                ><span class="text-weight-bold">Snapshot</span>
                Info</q-toolbar-title
              >

              <q-btn
                flat
                round
                dense
                icon="close"
                @click="onToggleSnapMeta()"
              ></q-btn>
            </q-toolbar>

            <q-card-section>
              <q-input
                label="Title"
                v-model="snapMeta.title"
                :value="snapMeta.title"
              ></q-input>
              <q-input label="Caption" v-model="snapMeta.caption"></q-input>
              <q-input label="Alt text" v-model="snapMeta.altText"></q-input>
              <q-input
                label="Description"
                v-model="snapMeta.description"
              ></q-input>
              <q-input label="Tags" v-model="snapMeta.tags"></q-input>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-show="showRecMeta"
          class="top-left full-width z-max"
          style="opacity: 100"
        >
          <q-card flat>
            <q-toolbar>
              <q-avatar>
                <q-icon name="mdi-information"></q-icon>
              </q-avatar>
              <q-toolbar-title
                ><span class="text-weight-bold">Recording</span>
                Info</q-toolbar-title
              >

              <q-btn
                flat
                round
                dense
                icon="close"
                @click="onToggleRecMeta()"
              ></q-btn>
            </q-toolbar>

            <q-card-section>
              <q-input label="Title" v-model="recMeta.title"></q-input>
              <q-input label="Caption" v-model="recMeta.caption"></q-input>
              <q-input label="Alt text" v-model="recMeta.altText"></q-input>
              <q-input
                label="Description"
                v-model="recMeta.description"
              ></q-input>
              <q-input label="Tags" v-model="recMeta.tags"></q-input>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-show="view == 'snapshot'" class="ofh">
        <canvas :ref="canvasId" :width="vWidth" :height="vHeight">
          <img :ref="imgId" :src="snapshotImgUrl" :width="vWidth" />
        </canvas>
      </div>

      <!-- SNAPSHOT CONTROLS -->

      <div
        v-show="view == 'snapshot'"
        class="row col-12 video-controls q-px-md q-pb-sm"
      >
        <q-btn
          round
          icon="mdi-download"
          class="video-control-btn"
          @click="onSnapDownload()"
        ></q-btn>

        <q-space></q-space>

        <q-btn
          round
          icon="mdi-note"
          class="video-control-btn"
          @click="onToggleSnapMeta()"
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

      <div
        v-show="view == 'video'"
        class="row col-12 video-controls q-px-md q-pb-sm"
      >
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

        <q-btn
          round
          icon="mdi-download"
          v-show="recorderState === 'stopped'"
          @click="this.onRecordDownload()"
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
          icon="mdi-note"
          @click="onToggleRecMeta()"
          v-show="recorderState === 'stopped'"
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

      <div v-show="view == 'whiteboard'">
        <white-board :width="vWidth" :height="vHeight"></white-board>
      </div>

      <div
        v-show="view === 'selectSource'"
        :style="'min-height: ' + vHeight + 'px'"
        class="flex flex-center selec"
      >
        <video-source-selector
          :videoSourceList="cameras"
          @selectedSource="(event) => onChangeVideoSource(event)"
          :videoTypes="videoTypes"
        ></video-source-selector>
      </div>
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
      saveNuggetSnap,
      recordStart,
      recordPause,
      recordResume,
      recordStop,
      recordDelete,
      recordDownload,
      recordSave,
      cameraRes,
      snapMeta,
      recMeta,
      deleteSnap,
    } = useMultiCorder();

    const view = ref("selectSource");

    const showSnapshot = ref(false);

    onMounted(() => {
      initVideoOptions(props.videoTypes);
    });

    const videoId = "video_" + props.uniq;
    const canvasId = "canvas_" + props.uniq;
    const imgId = "img_" + props.uniq;

    const vWidth = ref(0);

    const calcWidth = () => {
      let targetWidth;

      let viewWidth = 0;

      // Get the available width as reported by Quasar
      // This isn't hardware width, but browser window width.
      viewWidth = $q.screen.width;
      console.log("Quasar screen width: " + viewWidth);

      targetWidth =
        props.width < viewWidth * 0.96 ? props.width : viewWidth * 0.96;
      console.log("Target Width: " + targetWidth);

      return targetWidth;
    };

    const vRatio = ref(0.5625);

    const vHeight = computed(() => {
      return vWidth.value * vRatio.value;
    });

    const onResize = (size) => {
      console.log("RESIZED: " + size);
      vWidth.value = calcWidth();
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

    // Flag to track whether a notes form should be displayed for media.
    // These notes get saved to blocks in the Nugget with specific types.
    const showSnapMeta = ref(false); // block type snap-note
    const showRecMeta = ref(false); // block type recording-note

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
      saveNuggetSnap,
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
      showSnapMeta,
      showRecMeta,
      cameraRes,
      snapMeta,
      recMeta,
      deleteSnap,
      vRatio,
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
      console.log(this.vWidth, this.vHeight);
      console.log(this.cameraRes);

      this.videoSnapshot(this.vWidth, this.vHeight);
      this.setView("snapshot");
    },
    onSnapDelete() {
      this.deleteSnap(this.nuggetId);
      this.showSnapMeta = false;
      this.setView("video");
    },
    async onSnapDownload() {
      await this.downloadSnapshot();
    },
    async onSnapSave() {
      await this.saveNuggetSnap(this.nuggetId);
      await this.onSnapDelete();
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
      this.showRecMeta = false;
      this.recordDelete();
    },

    async onRecordDownload() {
      console.log("MC - onRecordDownload");
      await this.recordDownload();
    },

    async onRecordSave() {
      console.log("MC - onRecordSave");
      await this.recordSave(this.nuggetId);
      this.onRecordDelete();
    },

    onToggleSnapMeta() {
      console.log("MC - onToggleSnapMeta");
      this.showSnapMeta = !this.showSnapMeta;
    },

    onToggleRecMeta() {
      console.log("MC - onToggleRecMeta");
      this.showRecMeta = !this.showRecMeta;
    },

    getVideoDimensions(e) {
      console.log("Element Height " + e.target.videoHeight);
      console.log("Element Width " + e.target.videoWidth);
      const newRatio = e.target.videoHeight / e.target.videoWidth;
      this.vRatio = newRatio;
      console.log("newRatio " + newRatio);
      console.log("vHeight " + this.vHeight);
      console.log("vWidth " + this.vWidth);
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

.nospc {
  padding: 0;
  margin: 0;
}

.selec {
  background-color: lightgray;
}

.ofh {
}
</style>
