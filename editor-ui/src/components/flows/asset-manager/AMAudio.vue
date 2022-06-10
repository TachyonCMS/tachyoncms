<template>
  <div class="row col-12">Audio</div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

import useFlows from "../../../composables/useFlows";

export default defineComponent({
  name: "AssetManagerAudio",
  props: ["nuggetId"],
  setup(props) {
    console.log(props);
    const { nuggetAssetMap } = useFlows();
    const tabView = ref("files");
    const nuggetAssets = computed(() => {
      return nuggetAssetMap.get(props.nuggetId);
    });
    return { nuggetAssets };
  },
});
</script>
