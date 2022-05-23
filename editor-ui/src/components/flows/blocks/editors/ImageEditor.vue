<template>
  <!-- Component div -->
  <div class="row col-12">
    <!-- Display image with live updates -->
    <div id="'img-' + editorData.id" class="row col-12">
      <q-img
        :src="editorData.url"
        :ratio="editorData.ratio"
        :fit="editorData.fit"
        ><div
          v-if="editorData.captionText"
          :class="
            editorData.captionPosition +
            ' ' +
            editorData.fontSize +
            ' ' +
            editorData.fontStyle +
            ' ' +
            editorData.fontWeight
          "
          :style="'color:' + editorData.fontColor"
        >
          <fnt :face="editorData.font" :txtStr="editorData.captionText">{{
            editorData.captionText
          }}</fnt>
        </div></q-img
      >
    </div>

    <!-- Image handling -->
    <div class="row col-12">
      <q-input
        outlined
        v-model="editorData.url"
        label="Image URL"
        class="col-12"
      ></q-input>
    </div>

    <div class="row col-12">
      <div class="row col-6">Aspect Ratio:</div>
      <div>
        <q-select
          filled
          v-model="editorData.ratio"
          :options="ratioOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <div class="row col-12">
      <div class="row col-6">Fit:</div>
      <div>
        <q-select
          filled
          v-model="editorData.fit"
          :options="fitOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <!-- Caption Options -->
    <div class="row col-12">
      <q-input
        outlined
        v-model="editorData.captionText"
        label="Caption"
        class="col-12"
      ></q-input>
      <div class="row col-6">Caption Position:</div>
      <div>
        <q-select
          filled
          v-model="editorData.captionPosition"
          :options="captionPositionOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
      <div class="row col-12">
        <div class="row col-6">Font:</div>
        <div>
          <q-select
            filled
            v-model="editorData.font"
            :options="fontOptions"
            emit-value
            map-options
            dense
            options-dense
            options-html
          ></q-select>
        </div>
      </div>
      <div class="row col-12">
        <div class="row col-6">Font Size:</div>
        <div>
          <q-select
            filled
            v-model="editorData.fontSize"
            :options="fontSizeOptions"
            emit-value
            map-options
            dense
            options-dense
            options-html
          ></q-select>
        </div>
      </div>
      <div class="row col-12">
        <div class="row col-6">Font Style:</div>
        <div>
          <q-select
            filled
            v-model="editorData.fontStyle"
            :options="fontStyleOptions"
            emit-value
            map-options
            dense
            options-dense
            options-html
          ></q-select>
        </div>
      </div>
      <div class="row col-12">
        <div class="row col-6">Font Weight:</div>
        <div>
          <q-select
            filled
            v-model="editorData.fontWeight"
            :options="fontWeightOptions"
            emit-value
            map-options
            dense
            options-dense
            options-html
          ></q-select>
        </div>
      </div>
      <div class="row col-12">
        <div class="row col-6">Font Color:</div>
        <div>
          <q-input filled v-model="editorData.fontColor" :rules="['hexColor']">
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color v-model="editorData.fontColor"></q-color>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <!-- Control buttons -->
    <div class="row col-12">
      <q-space></q-space>
      <q-btn
        @click="this.clear()"
        class="subdued-btn"
        icon-right="mdi-sync"
        flat
        size="sm"
        label="Clear"
        :disabled="!dirtyBit"
      ></q-btn>
      <q-btn
        @click="
          this.$emit('save', { newData: editorData });
          this.dirtyBit = false;
        "
        class="option-btn"
        icon="save"
        size="sm"
        :disabled="!dirtyBit"
        label="Save"
      ></q-btn>
      <q-space></q-space>
      <q-btn
        @click="this.$emit('close')"
        class="subdued-btn"
        icon-right="mdi-close"
        flat
        size="sm"
        label="Close"
        :disabled="dirtyBit"
      ></q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";

import Fnt from "../../../site/widgets/Font";

/*
{
  url: 'https://*',
  ratio: '16-9|1|4-3',
  captionText: 'Image caption example',
  captionClass: 'bot|top|center|bot-right',
  fit: 'cover|fill|contain|none|scale-down',
}
*/
export default defineComponent({
  name: "ImageEditor",
  props: ["displayData"],
  components: {
    Fnt,
  },
  emits: ["save", "close"],
  setup(props) {
    console.log(props);
    let rawData = {
      url: "",
      ratio: "1",
      fit: "scale-down",
      captionText: "",
      captionPosition: "absolute-full text-subtitle2 flex flex-center",
      font: "Arial",
      fontSize: "medium",
      fontStyle: "normal",
      fontWeight: "text-weight-regular",
      fontColor: "#ffffff",
    };

    if (props.displayData) {
      rawData = { ...props.displayData };
      console.log(rawData);
    }

    const editorData = reactive(rawData);

    const displayColorPicker = ref(false);

    const ratioOptions = [
      {
        label: "1 - original size",
        value: "1",
      },
      {
        label: "4/3 - fullscreen",
        value: "1.333",
      },
      {
        label: "16/9 - widescreen",
        value: "1.7777",
      },
    ];

    const fitOptions = [
      {
        label: "Cover",
        value: "cover",
      },
      {
        label: "Fill",
        value: "fill",
      },
      {
        label: "Contain",
        value: "contain",
      },
      {
        label: "None",
        value: "none",
      },
      {
        label: "Scale Down",
        value: "scale-down",
      },
    ];

    const captionPositionOptions = [
      {
        label: "Center",
        value: "absolute-full text-subtitle2 flex flex-center",
      },

      {
        label: "Top",
        value: "absolute-top text-center",
      },
      {
        label: "Top-left",
        value: "absolute-top-left",
      },
      {
        label: "Top-right",
        value: "absolute-top-right",
      },
      {
        label: "Bottom",
        value: "absolute-bottom text-subtitle1 text-center",
      },
      {
        label: "Bottom-left",
        value: "absolute-bottom-left text-subtitle2",
      },
      {
        label: "Bottom-right",
        value: "absolute-bottom-right text-subtitle2",
      },
    ];

    const fontStyleOptions = ["Normal", "Italic"];

    const fontOptions = [
      {
        label: "<span style='font-family:Arial'>Arial</span>",
        value: "Arial",
      },
      {
        label: "<span style='font-family:Arial Black'>Arial Black</span>",
        value: "Arial Black",
      },
      {
        label: "<span style='font-family:Comic Sans MS'>Comic Sans MS</span>",
        value: "Comic Sans MS",
      },
      {
        label: "<span style='font-family:Courier New'>Courier New</span>",
        value: "Courier New",
      },
      {
        label: "<span style='font-family:Impact'>Impact</span>",
        value: "Impact",
      },
      {
        label: "<span style='font-family:Lucida Grande'>Lucida Grande</span>",
        value: "Lucida Grande",
      },
      {
        label:
          "<span style='font-family:Times New Roman'>Times New Roman</span>",
        value: "Times New Roman",
      },
      {
        label: "<span style='font-family:Verdana'>Verdana</span>",
        value: "Verdana",
      },
    ];

    const fontSizeOptions = [
      {
        label: "Very small",
        value: "x-small",
      },
      {
        label: "A bit small",
        value: "small",
      },
      {
        label: "Normal",
        value: "medium",
      },
      {
        label: "Medium-large",
        value: "large",
      },
      {
        label: "Big",
        value: "x-large",
      },
      {
        label: "Very big",
        value: "xx-large",
      },
      {
        label: "Maximum",
        value: "6em",
      },
    ];

    const fontWeightOptions = [
      {
        label: "<span class='text-weight-thin'>Thin</span>",
        value: "text-weight-thin",
      },
      {
        label: "<span class='text-weight-light'>Light</span>",
        value: "text-weight-light",
      },
      {
        label: "<span class='text-weight-regular'>Regular</span>",
        value: "text-weight-regular",
      },
      {
        label: "<span class='text-weight-medium'>Medium</span>",
        value: "text-weight-medium",
      },
      {
        label: "<span class='text-weight-bold'>Bold</span>",
        value: "text-weight-bold",
      },
      {
        label: "<span class='text-weight-bolder'>Bolder</span>",
        value: "text-weight-bolder",
      },
    ];

    const dirtyBit = ref(false);

    watch(editorData, (value) => {
      if (value) {
        dirtyBit.value = true;
      }
    });

    return {
      editorData,
      ratioOptions,
      fitOptions,
      captionPositionOptions,
      fontOptions,
      fontSizeOptions,
      fontStyleOptions,
      fontWeightOptions,
      displayColorPicker,
      dirtyBit,
    };
  },
});
</script>

<style>
.xx-small {
  font-size: xx-small;
}

.x-small {
  font-size: x-small;
}

.small {
  font-size: small;
}
.medium {
  font-size: medium;
}
.large {
  font-size: large;
}
.x-large {
  font-size: x-large;
}
.xx-large {
  font-size: xx-large;
}
.xxx-large {
  font-size: xxx-large;
}

.Italic {
  font-style: italic;
}

.Normal {
  font-style: normal;
}

.color-picker {
}
</style>
