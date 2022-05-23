<template>
  {{ formatDate(rawDate, displayFormat) }}
  <q-tooltip anchor="center start" :delay="400">
    {{ label }}:
    {{ formatDate(rawDate, "MMM DD YYYY h:mm:ss a") }}
  </q-tooltip>
</template>

<script>
import { defineComponent } from "vue";

import { date } from "quasar";
const { formatDate } = date;

export default defineComponent({
  name: "DateDisplay",
  props: {
    rawDate: {
      type: String,
    },
    label: {
      type: String,
    },
    displayFormat: {
      type: String,
      default: () => "YYYY/MM/DD",
    },
  },
  setup(props) {
    return {
      formatDate,
    };
  },
});
</script>
