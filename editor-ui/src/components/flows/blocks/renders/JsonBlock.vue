<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->

<template>
  <div class="row col-12">
    <vue-json-pretty :path="'res'" :data="data" class="fit"> </vue-json-pretty>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default defineComponent({
  name: "JsonBlock",
  components: {
    VueJsonPretty,
  },
  props: ["data", "dataCySlug"],
  setup(props) {
    console.log("JSON Block");
    console.log(props);
  },
  methods: {},
});
</script>
