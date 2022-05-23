<template>
  <q-expansion-item
    expand-separator
    :icon="icon"
    :label="collectionFormLabel"
    header-class="form-header text-h6"
    @show="collectionFormOpen = true"
    @hide="collectionFormOpen = false"
  >
    <q-card class="no-margin full-height">
      <component
        :is="formComponent"
        :condensed="true"
        class="collection-form-body"
        @closeForm="collectionFormOpen = false"
      ></component>
    </q-card>
  </q-expansion-item>
  <q-tooltip v-if="!collectionFormOpen">
    {{ tooltipText }}
  </q-tooltip>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

// Import the form components known to work as collection forms.
import NewFlowForm from "../../flows/forms/NewFlowForm.vue";
import NewNuggetForm from "../../flows/forms/NewNuggetForm.vue";

export default defineComponent({
  name: "ExpansionFormWrapper",

  props: ["icon", "objectType", "formComponent", "tooltipText"],

  setup(props) {
    const collectionFormOpen = ref(false);
    const collectionFormLabel = computed(() => {
      const label = collectionFormOpen.value
        ? "New " + props.objectType + " Form"
        : "Add " + props.objectType;
      return label;
    });
    return {
      collectionFormOpen,
      collectionFormLabel,
    };
  },

  // Register possible form components
  components: {
    NewFlowForm,
    NewNuggetForm,
  },
});
</script>
