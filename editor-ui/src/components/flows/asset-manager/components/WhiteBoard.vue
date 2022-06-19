<template>
  <div class="flex flex-center">
    <div class="row col-12">
      <div v-show="showControls" class="row col-12 justify-center tools">
        Edit Tool panel
      </div>
      <div class="row col-12 justify-center">
        <div class="row relative-position canvas">
          <vue-drawing-canvas
            ref="VueCanvasDrawing"
            v-model:image="image"
            :width="cWidth"
            :height="cHeight"
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
        </div>
      </div>
      <div class="row col-12 justify-center controls">CMS Control buttons</div>
    </div>
    <q-input v-model="cWidth"></q-input>
    {{ divSize }}
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

    const cHeight = ref(300);
    const cWidth = ref(900);

    onMounted(() => {
      if ("vue-drawing-canvas" in window.localStorage) {
        initialImage.value = JSON.parse(
          window.localStorage.getItem("vue-drawing-canvas")
        );
      }
    });

    const divSize = ref(0);

    // We only carer about the event, not the content of the resize event.
    const onResize = (size) => {
      console.log(size);
      divSize.value = size;
      // cWidth.value = size.width + 10;
      //resized.value = true; // Trigger a vHeight recalculation
      //resized.value = false;
    };

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
      cWidth,
      cHeight,
      onResize,
      divSize,
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
  margin: 0;
  padding: 0;
}

.tools {
  background-color: grey;
}
</style>
