<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->

<template>
  <div class="row col-12">
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "JsonBlock",
  components: {},
  props: ["data", "dataCySlug"],
  setup(props) {
    console.log("JSON Block");
    console.log(props);
  },
  methods: {},
});
</script>
