<template>
  <div class="row col-12">
    <div class="row col-12">
      <heading :data="editorData"></heading>
    </div>
    <div class="row col-12">
      <q-input
        outlined
        v-model="editorData.heading"
        :label="label"
        class="col-12"
        :data-cy="dataCySlug + '-heading-fld'"
      ></q-input>
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
          :data-cy="dataCySlug + '-clear-btn'"
        ></q-btn>
        <q-btn
          @click="this.onSave()"
          class="option-btn"
          icon="save"
          size="sm"
          :disabled="!dirtyBit"
          label="Save"
          :data-cy="dataCySlug + '-save-btn'"
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
          :data-cy="dataCySlug + '-close-btn'"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  reactive,
  computed,
  onMounted,
} from "vue";
import { useQuasar } from "quasar";

import Heading from "../renders/HeadingBlock";

export default defineComponent({
  name: "HeadingEditor",
  props: ["data", "dataCySlug"],
  emits: ["save", "close", "delete"],
  components: {
    Heading,
  },
  setup(props) {
    console.log("HEADING EDITOR");
    const $q = useQuasar();
    console.log(props);

    // We know this to be a shallow object so this should provide a non-reactive copy.
    const rawData = Object.assign({}, props.data);

    // Create a local reactive object, not linked to the props.
    const editorData = reactive(rawData);

    // Set to true, if the data has changed
    const dirtyBit = ref(false);

    const savedHeading = ref();

    // Undo any UNSAVED changes
    const clear = () => {
      console.log("Clearing");
      editorData.heading = savedHeading.value;
      dirtyBit.value = false;
    };

    // Watch for changes and update the dirtyBit accordingly
    watch(editorData, (value) => {
      console.log(value);
      if (value.heading === savedHeading.value) {
        dirtyBit.value = false;
      } else {
        dirtyBit.value = true;
      }
    });

    // Define the label for the field
    const label = computed(() => {
      return "H" + editorData.level + " Heading";
    });

    onMounted(async () => {
      savedHeading.value = editorData.heading;
    });

    // Expose these to the rest of the script
    return {
      dirtyBit,
      label,
      clear,
      editorData,
      savedHeading,
    };
  },
  methods: {
    async onSave() {
      const dataObj = { newData: this.editorData };
      this.savedHeading = this.editorData.heading;
      this.$emit("save", dataObj);
      this.dirtyBit = false;
    },
  },
});
</script>
