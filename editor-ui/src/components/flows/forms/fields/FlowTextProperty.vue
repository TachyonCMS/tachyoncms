<template>
  <div class="row">
    <div class="col-3 collection-item-label">{{ label }}:</div>
    <div class="col-9 collection-item-value">
      <span class="cursor-pointer">
        {{ editValue }}
        <q-icon
          size="xs"
          name="edit"
          v-if="!editValue || editValue.length < 1"
        ></q-icon>
        <q-popup-edit
          v-model="editValue"
          :validate="(val) => val && val.length > 0"
          @save="
            (v, iv) => {
              updateFlowProp(flowId, propName, v);
            }
          "
        >
          <template v-slot="scope">
            <q-input
              autofocus
              dense
              v-model="scope.value"
              :model-value="scope.value"
              :hint="hintText"
              :rules="
                required
                  ? [
                      (val) =>
                        scope.validate(val) || 'You must include a ' + label,
                    ]
                  : [(val) => true]
              "
            >
              <template v-slot:after>
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="cancel"
                  @click.stop="scope.cancel"
                ></q-btn>

                <q-btn
                  flat
                  dense
                  color="positive"
                  icon="check_circle"
                  @click.stop="scope.set"
                  :disable="
                    (required && scope.validate(scope.value) === false) ||
                    scope.initialValue === scope.value
                  "
                ></q-btn>
              </template>
            </q-input>
          </template>
        </q-popup-edit>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, unref } from "vue";
import useFlows from "../../../../composables/useFlows";

export default defineComponent({
  name: "FlowTextProperty",
  emits: ["appNotification"],
  props: [
    "label",
    "propName",
    "propValue",
    "flowId",
    "rules",
    "hintText",
    "required",
  ],
  setup(props) {
    const { updateFlowProp } = useFlows();
    const editValue = unref(props.propValue);
    return {
      updateFlowProp,
      editValue,
    };
  },
});
</script>
