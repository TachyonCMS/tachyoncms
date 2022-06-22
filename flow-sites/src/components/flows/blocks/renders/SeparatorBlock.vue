<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
  <div class="row col-12">
    <!-- Display separator with live updates -->
    <div
      :class="
        'row col-12 q-pt-' +
        data.padTop +
        ' q-pb-' +
        data.padBot +
        ' q-px-' +
        data.padSides
      "
    >
      <q-separator
        :color="data.color + '-' + data.colorVar"
        :size="data.size"
        class="col-12"
        spaced="q-ma-lg"
      ></q-separator>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SeparatorBlock",
  components: {},
  props: ["data", "dataCySlug"],
  setup(props) {
    let defaultData = {
      padTop: "xs",
      padBot: "xs",
      padSides: "md",
      size: ".2em",
      color: "green",
      colorVar: "4",
    };

    return {};
  },
  methods: {},
});
</script>
