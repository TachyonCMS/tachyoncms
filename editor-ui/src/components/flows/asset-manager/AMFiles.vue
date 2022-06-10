<template>
  <div class="relative-position row">
    <div class="row col-12">
      <q-space></q-space>
      <q-file
        filled
        v-model="files"
        label="Upload Files"
        multiple
        append
      ></q-file>
      <q-btn
        icon="mdi-upload"
        @click="onUpload(nuggetId)"
        size="md"
        condensed
        padding="sm"
        ><q-tooltip>Upload</q-tooltip></q-btn
      >
      <q-space></q-space>
      <q-btn
        icon="mdi-refresh"
        @click="loadNuggetAssets(nuggetId, true)"
        size="md"
        padding="sm"
        ><q-tooltip>Refresh</q-tooltip></q-btn
      >
    </div>
    {{ files }}
    <div class="row col-12">
      <q-list v-for="asset in nuggetAssets" :key="asset" class="row col-12">
        <q-item class="row col-12">
          <q-item-label class="text-left no-wrap">{{ asset }}</q-item-label>
          <q-space></q-space>

          <q-btn
            icon="delete"
            @click="deleteNuggetAsset(nuggetId, asset)"
            size="sm"
            padding="sm"
            ><q-tooltip>Delete</q-tooltip></q-btn
          >
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

import useFlows from "../../../composables/useFlows";

export default defineComponent({
  name: "AssetManagerFiles",
  props: ["nuggetId"],
  setup(props) {
    console.log(props);
    const { nuggetAssetMap, loadNuggetAssets, deleteNuggetAsset } = useFlows();
    const tabView = ref("files");
    const nuggetAssets = computed(() => {
      return nuggetAssetMap.get(props.nuggetId);
    });
    const files = ref(null);
    return { nuggetAssets, loadNuggetAssets, deleteNuggetAsset, files };
  },
  methods: {
    async onUpload(nuggetId) {
      //console.log(this.nuggetId);
      console.log(nuggetId);
      console.log(this.files[0]);
    },
    async onSelectConnector(connector) {
      // Record the connector choice
      //this.setFlowConnector(connector);

      // Display sources options for the connector
      switch (connector) {
        case "electron":
          this.onSelectRootDir();
          break;
        case "storageApi":
          this.onStorageApi();
          break;
        case "filesystem":
          this.onFilesystem();
          break;
      }
    },
  },
});
</script>
