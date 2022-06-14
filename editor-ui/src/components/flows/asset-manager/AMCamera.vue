<template>
  <div class="row col-12 text-center justify-center items-center">
    <div class="videobox">
      <multi-corder
        ref="multicorder"
        :video-source="videoSource"
        :videoTypes="videoTypes"
        :recorderMode="recorderMode"
        @error="onError"
        @cameras="onCameras"
        @video-live="onVideoLive"
        @view-change="onViewChange"
        @new-recording="onNewRecording"
        @delete-recording="onDeleteRecording"
        @player-loaded="onPlayerLoaded"
      ></multi-corder>
    </div>
    {{ videoSourceList }}
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

// This provides the shared code for the HTML5 Recording.
import MultiCorder from "./MultiCorder";

/**
 * Wraps Multicorder in a Camera specific UI.
 * This is useful for adding a camera to any blocks display or editor component.
 * The camera is designed to save the data to the Containing Nugget.
 */
export default defineComponent({
  name: "AssetManagerCamera",
  emits: ["cameras", "error", "notification"],
  components: {
    MultiCorder,
  },
  props: {
    recorderMode: {
      type: String,
      default: "single",
    },
  },
  setup(props, { emit }) {
    console.log(props);

    const controls = ref(null);
    const videoSource = ref(null);
    const videoSourceList = ref([]);
    const isPaused = ref(false);
    const isPlayerPaused = ref(false);
    const isMuted = ref(true);
    const isPlayerMuted = ref(true);
    const view = ref("video");
    const recordings = ref([]);

    return {
      controls,
      videoSource,
      videoSourceList,
      isPaused,
      isPlayerPaused,
      isMuted,
      isPlayerMuted,
      view,
      recordings,
    };
  },
  methods: {
    onError(error) {
      console.log("Error emitted", error);
    },
    onCameras(cameras) {
      console.log("Available cameras", cameras);
      /**
       * We are implementing a `multicorder` with camera and screen support.
       * We need to create a list that groups the items for a `v-select` component.
       * We use the `listFromCameras` helper function provided by the component.
       * The Multicorder component maintains a list of `cameras` if we need them independently.
       */
      this.videoSourceList = this.$refs.multicorder.listFromCameras(cameras);
    },
    onVideoLive() {
      this.controls = "liveVideo";
    },
    onViewChange(view) {
      this.view = view;
    },
    onNewRecording(recording) {
      this.recordings.push(recording);
      if (this.recorderMode == "single") {
        // Load the video into the player and force disposition
        // this.view = "videoPlayer";
        this.loadRecording(0);
      }
    },
    onDeleteRecording(index) {
      this.recordings.splice(index, 1);
      if (this.recorderMode == "single") {
        this.controls = "liveVideo";
      }
    },
    onPlayerLoaded() {
      //this.playRecording();
    },
    videoRecord() {
      this.controls = "recordingVideo";
      this.$refs.multicorder.startVideoRecording();
    },
    videoSnapshot(fromView) {
      this.$refs.multicorder.videoSnapshot(fromView);
    },
    videoClose() {
      this.$refs.multicorder.stopVideo();
      this.view = "video";
      this.controls = "liveVideo";
      this.videoSource = null;
    },
    videoStopRecording() {
      this.$refs.multicorder.stopRecording();
      // resume the video, minus recording
      this.resume();
    },
    resume() {
      this.isPaused = false;
      this.$refs.multicorder.resume();
    },
    pause() {
      this.isPaused = true;
      this.$refs.multicorder.pause();
    },
    closeSnapshot() {
      this.$refs.multicorder.closeSnapshot();
    },
    snapshotDownload() {
      this.$refs.multicorder.downloadSnapshot();
    },
    downloadRecording(index) {
      if (this.recorderMode === "single") {
        index = 0;
      }
      this.$refs.multicorder.downloadRecording(index);
    },
    deleteRecording(index) {
      if (this.recorderMode === "single") {
        index = 0;
      }
      this.$refs.multicorder.deleteRecording(index);
    },
    async loadRecording(index) {
      await this.$refs.multicorder.loadRecording(index);
    },
    playRecording() {
      this.isPlayerPaused = false;
      this.$refs.multicorder.playRecording();
    },
    pausePlayer() {
      this.isPlayerPaused = true;
      this.$refs.multicorder.pausePlayer();
    },
    resumePlayer() {
      this.isPlayerPaused = false;
      this.$refs.multicorder.resumePlayer();
    },
    deletePlayerRecording() {
      this.$refs.multicorder.deletePlayerRecording();
    },
    closePlayer() {
      this.$refs.multicorder.closePlayer();
    },
    toggleMuted() {
      this.isMuted = !this.isMuted;
    },
    togglePlayerMuted() {
      this.isPlayerMuted = !this.isPlayerMuted;
    },
  },
});
</script>

<style scoped>
.videobox {
  background-color: black;
}
</style>
