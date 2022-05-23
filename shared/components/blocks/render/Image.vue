<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
  <q-img
    :src="displayData.url"
    :ratio="displayData.ratio"
    :fit="displayData.fit"
    ><div
      v-if="displayData.captionText"
      :class="
        displayData.captionPosition +
        ' ' +
        displayData.fontSize +
        ' ' +
        displayData.fontStyle +
        ' ' +
        displayData.fontWeight
      "
      :style="'color:' + displayData.fontColor"
    >
      <fnt
        :face="displayData.font"
        :txtStr="displayData.captionText"
      ></fnt></div
  ></q-img>
</template>

<script>
import { defineComponent } from "vue";

import Fnt from "../../../site/widgets/Font";

export default defineComponent({
  name: "ImageDisplay",
  components: { Fnt },
  props: ["displayData"],
  setup(props) {
    console.log("ImageDisplay");
    console.log(props);

    return {};
  },
  methods: {},
});
</script>
