<template>
  <div class="row col-12">
    <q-tabs
      v-model="tabView"
      inline-label
      dense
      no-caps
      outside-arrows
      mobile-arrows
      @show="loadNuggetAssets(nuggetId)"
      class="row col-12 text-center"
    >
      <q-tab name="files" icon="mdi-file-multiple" label="Files"></q-tab>
      <q-tab name="camera" icon="camera" label="Camera"></q-tab>
      <q-tab name="screen" icon="monitor" label="Screen"></q-tab>
      <q-tab name="audio" icon="mdi-microphone" label="Audio"></q-tab>
    </q-tabs>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

const { nuggetAssetMap } = require("../../composables/useFlows.js");

export default defineComponent({
  name: "AssetManager",
  props: ["nuggetId"],
  setup(props) {
    console.log(props);
    const tabView = ref("files");
    const nuggetAssets = computed(() => {
      return nuggetAssetMap.get(nuggetId);
    });
    return { tabView, nuggetAssets };
  },
});
</script>
