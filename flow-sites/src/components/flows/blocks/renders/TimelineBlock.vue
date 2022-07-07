<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
    <div class="q-px-lg q-pb-md">
        <q-timeline :layout="layout" color="secondary">
            <template v-for="event in data.events" :key="event.id">
                <q-timeline-entry
                    :title="event.title"
                    :subtitle="event.subtitle"
                    :side="event.side"
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

import { useQuasar } from "quasar";

export default defineComponent({
    name: "TimelineBlock",
    components: {},
    props: ["data", "dataCySlug"],
    setup(props) {
        const $q = useQuasar();

        console.log(props);

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
