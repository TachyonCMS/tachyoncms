<template>
  <div class="row">
    <div class="column">
      <div class="row">
        <div v-show="showTools" class="col-12">Edit Tool panel</div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="row relative-position canvas">
            <canvas id="imgCanvas" width="600" height="400"></canvas>
            <q-btn
              icon="mdi-image-edit"
              class="top-right"
              @click="showTools = !showTools"
            ></q-btn>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-btn round icon="mdi-microphone" class="video-control-btn"></q-btn>
          <q-btn
            round
            icon="mdi-microphone-off"
            class="video-control-btn"
          ></q-btn>
          <q-btn round icon="mdi-volume-high" class="video-control-btn"></q-btn>
          <q-btn round icon="mdi-volume-off" class="video-control-btn"></q-btn>
        </div>
      </div>
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
  components: {},
  props: [],
  setup(props, { emit }) {
    const showTools = ref(false);
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
      showTools,
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
.controls {
  background-color: yellow;
}

.canvas {
  background-color: blue;
}

.tools {
  background-color: grey;
}
</style>
