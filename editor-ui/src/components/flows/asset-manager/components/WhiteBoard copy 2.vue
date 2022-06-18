<template>
  <div class="flex flex-center">
    <div class="row relative-position">
      <vue-drawing-canvas
        ref="VueCanvasDrawing"
        v-model:image="image"
        :width="600"
        :height="400"
        :stroke-type="strokeType"
        :line-cap="lineCap"
        :line-join="lineJoin"
        :fill-shape="fillShape"
        :eraser="eraser"
        :lineWidth="line"
        :color="color"
        :background-color="backgroundColor"
        :background-image="backgroundImage"
        :watermark="watermark"
        :initial-image="initialImage"
        saveAs="png"
        :styles="{
          border: 'solid 1px #000',
        }"
        :lock="disabled"
        @mousemove="getCoordinate($event)"
        :additional-images="additionalImages"
      />
      <q-btn
        icon="mdi-image-edit"
        class="top-right"
        @click="showControls = !showControls"
      ></q-btn>
      <div
        v-show="showControls"
        class="fit row col-12 text-center justify-center items-center"
      >
        <div class="row col-12 text-center justify-center items-center">
          x-axis: <strong>{{ x }}</strong
          >, y-axis: <strong>{{ y }}</strong>
        </div>
        <div
          class="button-container fit row col-12 text-center justify-center items-center"
        >
          <button type="button" @click.prevent="disabled = !disabled">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-lock"
              viewBox="0 0 16 16"
            >
              <path
                v-if="!disabled"
                d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"
              />
              <path
                v-else
                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
              />
            </svg>
            <span v-if="!disabled">Unlock</span>
            <span v-else>Lock</span>
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.undo()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-counterclockwise"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
              />
              <path
                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"
              />
            </svg>
            Undo
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.redo()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
              />
              <path
                d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
              />
            </svg>
            Redo
          </button>
          <button
            type="button"
            @click.prevent="$refs.VueCanvasDrawing.redraw()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-repeat"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
              />
              <path
                fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              />
            </svg>
            Refresh
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.reset()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-file-earmark"
              viewBox="0 0 16 16"
            >
              <path
                d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
              />
            </svg>
            Reset
          </button>
        </div>

        <div
          class="button-container fit row col-12 text-center justify-center items-center"
        >
          <button type="button" @click.prevent="eraser = !eraser">
            <span v-if="eraser">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eraser"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"
                />
              </svg>
              Eraser
            </span>
            <span v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pencil"
                viewBox="0 0 16 16"
              >
                <path
                  d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                />
              </svg>
              Draw
            </span>
          </button>
          <select v-model="line">
            <option v-for="n in 25" :key="'option-' + n" :value="n">
              {{ n }}
            </option>
          </select>
          <input type="color" v-model="color" />
          <select v-model="strokeType">
            <option value="dash">Dash</option>
            <option value="line">Straight Line</option>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="half_triangle">Half Triangle</option>
          </select>
        </div>

        <div
          class="button-container fit row col-12 text-center justify-center items-center"
        >
          <select v-model="lineCap">
            <option value="round">lineCap Round</option>
            <option value="square">lineCap Square</option>
            <option value="butt">lineCap butt</option>
          </select>
          <select v-model="lineJoin">
            <option value="round">lineJoin Round</option>
            <option value="miter">lineJoin miter</option>
            <option value="bevel">lineJoin bevel</option>
          </select>
          <button type="button" @click.prevent="fillShape = !fillShape">
            <span v-if="fillShape">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-square-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"
                />
              </svg>
              Fill
            </span>
            <span v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-square"
                viewBox="0 0 16 16"
              >
                <path
                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                />
              </svg>
              Stroke
            </span>
          </button>
        </div>

        <div
          class="button-container row fit text-center justify-center items-center"
        >
          <button type="button" @click.prevent="getStrokes()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-image-alt"
              viewBox="0 0 16 16"
            >
              <path
                d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5l-4.777-3.947z"
              />
            </svg>
            Save All Strokes
          </button>
          <button type="button" @click.prevent="removeSavedStrokes()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eraser"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"
              />
            </svg>
            Remove Saved Strokes
          </button>
        </div>
        <div
          class="button-container row fit col-12 text-center justify-center items-center"
        >
          <div style="margin-right: 30px">
            <p style="margin-bottom: 0">Background Color:</p>
            <input type="color" v-model="backgroundColor" />
          </div>
          <div>
            <p style="margin-bottom: 0">Upload Background Image:</p>
            <input type="file" @change="setImage($event)" />
          </div>
        </div>

        <div
          class="button-container fit row col-12 text-center justify-center items-center"
        >
          <div>
            <p style="margin-bottom: 0">Upload Watermark Image:</p>
            <input type="file" @change="setWatermarkImage($event)" />
          </div>
        </div>
        <div v-show="view != 'selectSource'" class="video-controls">
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

  <div class="output">
    <p>Output:</p>
    <img :src="image" style="border: solid 1px #000000" />
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
    VueDrawingCanvas,
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
