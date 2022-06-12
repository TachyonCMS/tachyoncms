<template>
  <div class="justify-center row col-12">
    <p>
      <button id="setJSON">Set JSON</button>
      <button id="getJSON">Get JSON</button>
    </p>
    <div id="jsoneditor"></div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed } from "vue";
import { useQuasar } from "quasar";

const JSONEditor = require("jsoneditor");

const element = document.getElementById("jsoneditor");
const options = {};
const editor = new JSONEditor(element, options);

export default defineComponent({
  name: "JsonEditor",
  props: ["data", "dataCySlug"],
  emits: ["save", "close", "delete"],
  components: {},
  setup(props) {
    const $q = useQuasar();

    // We know this to be a shallow object so this should provide a non-reactive copy.
    const rawData = Object.assign({}, props.data);

    // Create a local reactive object, not linked to the props.
    const editorData = reactive(rawData);

    // Set to true, if the data has changed
    const dirtyBit = ref(false);

    // Undo any UNSAVED changes
    const clear = () => {
      console.log("Clearing");
      editorData = Object.assign({}, props.data);
      dirtyBit.value = false;
    };

    // Watch for changes and update the dirtyBit accordingly
    watch(editorData, (value) => {
      if (value && value.heading != props.data.heading) {
        dirtyBit.value = true;
      } else {
        // Catches the user manually undoing the change
        dirtyBit.value = false;
      }
    });

    // Define the label for the field
    const label = computed(() => {
      return "H" + editorData.level + " Heading";
    });

    // Expose these to the rest of the script
    return {
      dirtyBit,
      label,
      clear,
      editorData,
    };
  },
});
</script>

<style>
#jsoneditor {
  width: 600px;
  height: 500px;
}
</style>
