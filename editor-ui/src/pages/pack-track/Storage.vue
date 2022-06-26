<template>
  <q-page>
    <template v-if="flowSource">
      <q-list bordered>
        <expansion-form-wrapper
          icon="mdi-briefcase-plus"
          objectType="Flow"
          form-component="new-flow-form"
          tooltipText="Click to create a new flow"
        >
        </expansion-form-wrapper>
      </q-list>

      <template v-if="flowsLoaded">
        <q-list
          v-for="[flowId, flow] in flowMap"
          :key="flow.id"
          bordered
          separated
        >
          <q-expansion-item
            expand-icon-toggle
            icon="mdi-briefcase-edit"
            header-class="text-h6 collection-item-header"
            :label="flow.name"
            :to="'/flows/' + flowId + '/nuggets'"
            class="item-header"
          >
            <q-card class="item-body">
              <q-card-section class="collection-item-body">
                <div class="row">
                  <div class="col-3 collection-item-label">ID:</div>
                  <div class="col-9 collection-item-value">{{ flowId }}</div>
                </div>

                <flow-text-property
                  label="Name"
                  propName="name"
                  :propValue="flow.name"
                  :flowId="flowId"
                  hintText="Flow Name"
                  :required="true"
                >
                </flow-text-property>

                <flow-text-property
                  label="Title"
                  propName="title"
                  :propValue="flow.title"
                  :flowId="flowId"
                  hintText="Published Flow Title"
                  :required="false"
                >
                </flow-text-property>

                <div class="row">
                  <div class="col-3 collection-item-label">Publish:</div>
                  <div class="col-9 collection-item-value">
                    {{ flow.pubAt }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 collection-item-label">Expire:</div>
                  <div class="col-9 collection-item-value">
                    {{ flow.unPubAt }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 collection-item-label">Created:</div>
                  <div class="col-9 collection-item-value">
                    <date-display
                      :rawDate="flow.createdAt"
                      label="Created"
                    ></date-display>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 collection-item-label">Updated:</div>
                  <div class="col-9 collection-item-value">
                    <date-display
                      :rawDate="flow.updatedAt"
                      label="Updated"
                    ></date-display>
                  </div>
                </div>
                <div class="row" v-if="flow.notes">
                  <div class="col-3 collection-item-label">Notes:</div>
                  <div class="col-9 collection-item-value">
                    <span class="cursor-pointer">
                      {{ flow.notes }}
                      <q-icon
                        size="xs"
                        name="edit"
                        v-if="flow.notes.length < 1"
                      ></q-icon>
                      <q-popup-edit
                        v-model="flow.notes"
                        @save="
                          (v, iv) => {
                            updateFlowProp(flowId, 'notes', v);
                          }
                        "
                      >
                        <template v-slot="scope">
                          <q-input
                            type="textarea"
                            autofocus
                            dense
                            v-model="scope.value"
                            :model-value="scope.value"
                            hint="Flow notes"
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
                                :disable="scope.initialValue === scope.value"
                              ></q-btn>
                            </template>
                          </q-input>
                        </template>
                      </q-popup-edit>
                    </span>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions
                align="center"
                class="q-px-xl collection-item-actions"
              >
                <q-btn
                  class="subdued-btn"
                  flat
                  v-on:click="confirmDeleteFlow(flowId, flow.name)"
                  >Delete</q-btn
                >

                <q-btn class="option-btn" :to="'/flows/' + flowId + '/nuggets'"
                  >Manage</q-btn
                >
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </q-list>
      </template>
      <template v-else>
        <q-inner-loading :showing="true">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </template>
    </template>
    <template v-else>
      <NoFlowSourceSetPage></NoFlowSourceSetPage>
    </template>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  toRef,
  reactive,
  onMounted,
  watch,
} from "vue";

import { useQuasar } from "quasar";

import { useRouter } from "vue-router";

import useFlows from "../../composables/useFlows";

//import NewFlowForm from "../../components/flows/forms/NewFlowForm";
import DateDisplay from "../../components/site/widgets/DateDisplay";
import ExpansionFormWrapper from "../../components/site/lists/ExpansionFormWrapper";
import NoFlowSourceSetPage from "../../pages/flows/NoFlowSourceSetPage";
import FlowTextProperty from "../../components/flows/forms/fields/FlowTextProperty";

export default defineComponent({
  name: "PageFlows",
  emits: ["appNotification"],
  components: {
    //NewFlowForm,
    DateDisplay,
    ExpansionFormWrapper,
    FlowTextProperty,
    NoFlowSourceSetPage,
  },
  setup() {
    const {
      loadFlows,
      flowsLoaded,
      flowMap,
      deleteFlow,
      updateFlowProp,
      flowSource,
      flowConnector,
      setFlowConnector,
      flushAll,
    } = useFlows();

    const router = useRouter();

    // Include Quasar for dialog and loading indicator
    // @todo Move this to a component
    const $q = useQuasar();
    // Configure the loading indicator
    // https://quasar.dev/quasar-plugins/loading
    $q.loading.show({
      delay: 300, // ms
    });
    $q.loading.hide();

    const showLoading = () => {
      $q.loading.show({
        message: "Getting our flow on...",
      });
    };

    onMounted(async () => {
      if (!flowConnector.value || !flowSource.value) {
        // If we don't have the info needed to load flows redirect to homepage
        router.push("/");
      } else {
        loadFlows();
      }
    });

    // If the flowSource changes, flush all current data and load from the new source
    watch(flowSource, (value) => {
      flushAll();
      loadFlows();
    });

    return {
      flowMap,
      flowsLoaded,
      deleteFlow,
      updateFlowProp,
      flowSource,
    };
  },
  methods: {
    async confirmDeleteFlow(flowId, name) {
      const message = "Enter the name of the flow to confirm deletion: " + name;
      this.$q
        .dialog({
          title: "Confirm Flow Deletion",
          message: message,
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          if (data === name) {
            this.deleteFlow(flowId);
          } else {
            // Display an error message stating the name did not match
            this.$emit("appNotification", {
              type: "negative",
              name: "Confirmation failed",
              message: "You must enter the flow name: '" + name + "'",
            });
          }
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
  },
});
</script>
