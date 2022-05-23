<template>
  <!-- Component div -->
  <div class="row col-12">
    <!-- Display separator with live updates -->
    <div
      :class="
        'row col-12 q-pt-' +
        editorData.padTop +
        ' q-pb-' +
        editorData.padBot +
        ' q-px-' +
        editorData.padSides
      "
    >
      <q-separator
        :color="selectedColor"
        :size="editorData.size"
        class="col-12"
        spaced="q-ma-lg"
      ></q-separator>
    </div>
    <div class="row col-12">
      <div class="row col-6">Pad Top:</div>
      <div>
        <q-select
          filled
          v-model="editorData.padTop"
          :options="paddingOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>
    <div class="row col-12">
      <div class="row col-6">Pad Bottom:</div>
      <div>
        <q-select
          filled
          v-model="editorData.padBot"
          :options="paddingOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>
    <div class="row col-12">
      <div class="row col-6">Pad Sides:</div>
      <div>
        <q-select
          filled
          v-model="editorData.padSides"
          :options="paddingOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <div class="row col-12">
      <div class="row col-6">Size:</div>
      <div>
        <q-select
          filled
          v-model="editorData.size"
          :options="sizeOptions"
          emit-value
          map-options
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <div class="row col-12">
      <div class="row col-6">Color:</div>
      <div>
        <q-select
          filled
          v-model="editorData.color"
          :options="baseColors"
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <div class="row col-12">
      <div class="row col-6">Color Shade:</div>
      <div>
        <q-select
          filled
          v-model="editorData.colorVar"
          :options="colorVars"
          dense
          options-dense
        ></q-select>
      </div>
    </div>

    <!-- Control buttons -->
    <div class="row col-12">
      <q-space></q-space>
      <q-btn
        class="subdued-btn"
        icon-right="mdi-sync"
        flat
        size="sm"
        label="Clear"
        :disabled="!clearEnabled"
        @click="clear"
      ></q-btn>
      <q-btn
        @click="this.$emit('close')"
        class="subdued-btn"
        icon-right="mdi-close"
        flat
        size="sm"
        label="Close"
        :disabled="!closeEnabled"
      ></q-btn>
      <q-btn
        @click="
          this.$emit('save', { newData: editorData });
          dirtyBit = false;
        "
        class="option-btn"
        icon="save"
        size="sm"
        label="Save"
        :disabled="!saveEnabled"
      ></q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed, unref } from "vue";

const paddingOptions = [
  {
    label: "X-Small",
    value: "xs",
  },

  {
    label: "Small",
    value: "sm",
  },
  {
    label: "Medium",
    value: "md",
  },
  {
    label: "Large",
    value: "lg",
  },
  {
    label: "X-Large",
    value: "xl",
  },
];

const sizeOptions = [
  {
    label: "X-Small",
    value: ".2em",
  },

  {
    label: "Small",
    value: ".5em",
  },
  {
    label: "Medium",
    value: "1em",
  },
  {
    label: "Large",
    value: "2em",
  },
  {
    label: "X-Large",
    value: "4em",
  },
];

const baseColors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "oragne",
  "deep-orange",
  "brown",
  "grey",
  "blue-grey",
];

const colorVars = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];

export default defineComponent({
  name: "SeparatorEditor",
  props: ["displayData"],
  components: {},
  emits: ["save", "delete", "close"],
  setup(props) {
    let rawData = {
      padTop: "xs",
      padBot: "xs",
      padSides: "md",
      size: ".2em",
      color: "green",
      colorVar: "4",
    };

    const isNew = ref(false);

    if (props.displayData) {
      rawData = { ...rawData, ...props.displayData };
      console.log(rawData);
    } else {
      isNew.value = true;
    }

    const editorData = reactive(rawData);

    const clear = () => {
      console.log(editorData);
      console.log(props.displayData);
      Object.assign(editorData, props.displayData);
    };

    // Display popup color picker
    const displayColorPicker = ref(false);

    // Use the dirty bit to track if chnages have been made
    const dirtyBit = ref(false);

    watch(editorData, (value) => {
      const newData = Object.entries({ ...value }).toString();
      const origData = Object.entries({ ...props.displayData }).toString();
      if (value && newData != origData) {
        console.log({ ...value });
        console.log({ ...props.displayData });
        dirtyBit.value = true;
      } else {
        dirtyBit.value = false;
      }
    });

    const selectedColor = computed(() => {
      return editorData.color + "-" + editorData.colorVar;
    });

    const saveEnabled = computed(() => {
      return dirtyBit.value || isNew.value ? true : false;
    });

    const clearEnabled = computed(() => {
      return dirtyBit.value ? true : false;
    });

    const closeEnabled = computed(() => {
      return !isNew.value && !dirtyBit.value ? true : false;
    });

    return {
      editorData,
      dirtyBit,
      displayColorPicker,
      paddingOptions,
      sizeOptions,
      baseColors,
      colorVars,
      selectedColor,
      saveEnabled,
      clearEnabled,
      closeEnabled,
      clear,
    };
  },
});
</script>

<style></style>
