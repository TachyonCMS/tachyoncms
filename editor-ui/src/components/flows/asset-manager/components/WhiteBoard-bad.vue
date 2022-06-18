<template>
  <div class="flex flex-center">
    <div
      class="row col-12"
      v-show="['video'].includes(view)"
      :style="'width=: ' + vWidth + 'px'"
    >
      <div class="videobox row wrap justify-around items-start content-start">
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
            {{ videoSourceName }}
            <q-icon
              name="mdi-close-circle"
              @click="this.onCloseVideo(videoId)"
            ></q-icon>
          </div>
          <div
            v-show="view != 'selectSource'"
            class="row col-12 video-controls"
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
import VueDrawingCanvas from "vue-drawing-canvas";

import { defineComponent, ref, onMounted } from "vue";

import { useQuasar } from "quasar";

import useMultiCorder from "../useMultiCorder";

export default defineComponent({
  name: "WhiteBoard",
  components: {
    //VueDrawingCanvas,
  },
  props: [],
  setup(props, { emit }) {
    const showControls = ref(false);
    const initialImage = ref([
      {
        type: "dash",
        from: {
          x: 262,
          y: 154,
        },
        coordinates: [],
        color: "#000000",
        width: 5,
        fill: false,
      },
    ]);
    const x = ref(0);
    const y = ref(0);
    const image = ref("");
    const eraser = ref(false);
    const disabled = ref(false);
    const fillShape = ref(false);
    const line = ref(5);
    const color = ref("#000000");
    const strokeType = ref("dash");
    const lineCap = ref("square");
    const lineJoin = ref("miter");
    const backgroundColor = ref("#FFFFFF");
    const backgroundImage = ref(null);
    const watermark = ref(null);
    const additionalImages = ref([]);

    onMounted(() => {
      if ("vue-drawing-canvas" in window.localStorage) {
        initialImage.value = JSON.parse(
          window.localStorage.getItem("vue-drawing-canvas")
        );
      }
    });

    return {
      showControls,
      initialImage,
      x,
      y,
      image,
      eraser,
      disabled,
      fillShape,
      line,
      color,
      strokeType,
      lineCap,
      lineJoin,
      backgroundColor,
      backgroundImage,
      watermark,
      additionalImages,
    };
  },

  methods: {
    async setImage(event) {
      let URL = window.URL;
      this.backgroundImage = URL.createObjectURL(event.target.files[0]);
      await this.$refs.VueCanvasDrawing.redraw();
    },
    async setWatermarkImage(event) {
      let URL = window.URL;
      this.watermark = {
        type: "Image",
        source: URL.createObjectURL(event.target.files[0]),
        x: 0,
        y: 0,
        imageStyle: {
          width: 300,
          height: 200,
        },
      };
      await this.$refs.VueCanvasDrawing.redraw();
    },
    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    },
    getStrokes() {
      window.localStorage.setItem(
        "vue-drawing-canvas",
        JSON.stringify(this.$refs.VueCanvasDrawing.getAllStrokes())
      );
      alert(
        "Strokes saved, reload your browser to see the canvas with previously saved image"
      );
    },
    removeSavedStrokes() {
      window.localStorage.removeItem("vue-drawing-canvas");
      alert("Strokes cleared from local storage");
    },
  },
});
</script>

<style scoped>
body {
  font-family: "Roboto", sans-serif;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.button-container {
  display: flex;
  flex-direction: row;
}
.button-container > * {
  margin-top: 15px;
  margin-right: 10px;
}
</style>
