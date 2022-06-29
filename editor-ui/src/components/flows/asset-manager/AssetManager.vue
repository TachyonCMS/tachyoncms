<template>
  <div class="row col-12">
    <q-tabs
      v-model="tabView"
      inline-label
      dense
      no-caps
      outside-arrows
      mobile-arrows
      class="row col-12 text-center"
    >
      <!--  <q-tab name="camera" icon="camera" label="Camera"></q-tab>
      <q-tab name="audio" icon="mdi-microphone" label="Audio"></q-tab>
      <q-tab name="screen" icon="monitor" label="Screen"></q-tab>
      -->
      <q-tab name="file-manager" icon="mdi-file-multiple" label="Files"></q-tab>
      <q-tab name="multi-corder" icon="camera" label="Multicorder"></q-tab>
    </q-tabs>
    <div class="row col-12 text-center fit justify-center">
      <component :is="tabView" :nuggetId="nuggetId" width="3440"></component>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";

import useFlows from "../../../composables/useFlows";

import FileManager from "./AMFiles";
import MultiCorder from "./MultiCorder";

export default defineComponent({
  name: "AssetManager",
  components: {
    FileManager,
    MultiCorder,
  },
  props: ["nuggetId"],
  setup(props) {
    console.log(props);
    const tabView = ref("file-manager");
    const { loadNuggetAssets, nuggetAssetMap } = useFlows();
    const nuggetAssets = computed(() => {
      return nuggetAssetMap.get(props.nuggetId);
    });
    onMounted(() => {
      loadNuggetAssets(props.nuggetId);
    });
    return { tabView, nuggetAssets };
  },
});
</script>
