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
      <q-tab name="camera" icon="camera" label="Camera"></q-tab>
      <q-tab name="screen" icon="monitor" label="Screen"></q-tab>
    </q-tabs>

    <div class="row col-12 text-center fit justify-center">
      <file-manager
        :nuggetId="nuggetId"
        v-if="tabView == 'file-manager'"
      ></file-manager>
      <multi-corder
        v-if="tabView == 'camera'"
        :nuggetId="nuggetId"
        width="2048"
        :videoTypes="['camera']"
      ></multi-corder>
      <multi-corder
        v-if="tabView == 'screen'"
        :nuggetId="nuggetId"
        width="2048"
        :videoTypes="['screen']"
      ></multi-corder>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";

import useFlows from "../../../composables/useFlows";

import FileManager from "../../../components/flows/asset-manager/AMFiles";
import MultiCorder from "../../../components/flows/asset-manager/MultiCorder";
//import CameraSelectBtn from "../../components/flows/asset-manager/buttons/CameraSelectBtn";

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