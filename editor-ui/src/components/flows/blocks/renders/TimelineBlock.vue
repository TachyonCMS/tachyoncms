<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline :layout="layout" color="secondary">
      <template v-for="event in data.timeline" :key="event.id">
        <q-timeline-entry
          :title="event.title"
          :subtitle="event.date"
          :side="event.location"
          :heading="event.isHeading"
          :icon="event.icon"
          :color="event.color"
        >
          <div>{{ event.description }}</div>
        </q-timeline-entry>
      </template>
    </q-timeline>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "TimelineBlock",
  components: {},
  props: ["data", "dataCySlug"],
  setup(props) {
    const $q = useQuasar();

    return {
      layout: computed(() => {
        return $q.screen.lt.sm
          ? "dense"
          : $q.screen.lt.md
          ? "comfortable"
          : "loose";
      }),
    };
  },
  methods: {},
});
</script>
