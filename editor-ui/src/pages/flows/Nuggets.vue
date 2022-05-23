<template>
  <q-page>
    <template v-if="flowSource">
      <q-list bordered>
        <!-- Expansion form to add new Nuggets -->
        <q-expansion-item
          expand-separator
          icon="mdi-puzzle-plus"
          :label="collectionFormLabel"
          header-class="form-header text-h6"
          v-model="collectionFormOpen"
        >
          <q-card class="no-margin full-height">
            <new-nugget-form
              :flowId="flowId"
              :condensed="true"
              class="collection-form-body"
              @closeForm="collectionFormOpen = false"
            ></new-nugget-form>
          </q-card>
        </q-expansion-item>
        <!-- END expansion form -->

        <!-- Show a spinner over the div if the flow hasn't finished loading. -->
        <template v-if="flowLoaded">
          <template v-if="nuggetSeq">
            <!-- Reactive list of Nuggets from within the Flow object. -->
            <q-list v-for="nuggetId in nuggetSeq" :key="nuggetId">
              <div class="nugget-container">
                <q-expansion-item
                  expand-icon-toggle
                  header-class="text-h6 collection-item-header center"
                  :label="nuggetMap.get(nuggetId).name"
                >
                  <template #header>
                    <div>
                      <q-icon name="mdi-puzzle-edit" size="sm"></q-icon>
                    </div>
                    <q-space></q-space>
                    <div class="text-center">
                      <span class="cursor-pointer">
                        {{ nuggetMap.get(nuggetId).name }}
                        <q-icon
                          size="xs"
                          name="edit"
                          v-if="
                            !nuggetMap.get(nuggetId).name ||
                            nuggetMap.get(nuggetId).name < 1
                          "
                        ></q-icon>
                        <q-popup-edit
                          :model-value="nuggetMap.get(nuggetId).name"
                          auto-save
                          @save="
                            (v, iv) => {
                              updateNuggetProp(nuggetId, 'name', v);
                            }
                          "
                        >
                          <template v-slot="scope">
                            <q-input
                              autofocus
                              dense
                              v-model="scope.value"
                              :model-value="scope.value"
                              hint="Name for management purposes"
                              :rules="[
                                (val) =>
                                  scope.validate(val) ||
                                  'You must include a name',
                              ]"
                            >
                            </q-input>
                            <div>
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
                            </div>
                          </template>
                        </q-popup-edit>
                      </span>
                    </div>
                    <q-space></q-space>
                  </template>
                  <q-card>
                    <q-card-section class="collection-item-body">
                      <div class="row">
                        <div class="col-3 collection-item-label">ID:</div>
                        <div class="col-9 collection-item-value">
                          {{ nuggetId }}
                        </div>
                      </div>

                      <nugget-text-property
                        label="Name"
                        propName="name"
                        :propValue="nuggetMap.get(nuggetId).name"
                        :nuggetId="nuggetId"
                        hintText="Internal management name"
                        :required="true"
                      >
                      </nugget-text-property>

                      <nugget-text-property
                        label="Title"
                        propName="title"
                        :propValue="nuggetMap.get(nuggetId).title"
                        :nuggetId="nuggetId"
                        hintText="Public Title (accessible in blocks)"
                        :required="true"
                      >
                      </nugget-text-property>

                      <div class="row">
                        <div class="col-3 inline-form-label">Publish:</div>
                        <div class="col-9 inline-form-value">
                          <span class="cursor-pointer">
                            <date-display
                              :rawDate="nuggetMap.get(nuggetId).pubAt"
                              displayFormat="YYYY/MM/DD hh:mm a"
                              label="Publish At:"
                            ></date-display>
                            <q-icon
                              size="xs"
                              name="edit"
                              v-if="
                                !nuggetMap.get(nuggetId).pubAt ||
                                nuggetMap.get(nuggetId).pubAt < 1
                              "
                            ></q-icon>
                            <q-popup-edit
                              :model-value="nuggetMap.get(nuggetId).pubAt"
                              auto-save
                              @save="
                                (v, iv) => {
                                  const isoDate = v + ':00.000Z';
                                  updateNuggetProp(nuggetId, 'pubAt', isoDate);
                                }
                              "
                            >
                              <template v-slot="scope">
                                <q-date
                                  dense
                                  v-model="scope.value"
                                  :model-value="scope.value"
                                  mask="YYYY-MM-DDTHH:mm"
                                  hint="The day the Nugget is published."
                                >
                                </q-date>
                                <q-time
                                  dense
                                  v-model="scope.value"
                                  :model-value="scope.value"
                                  mask="YYYY-MM-DDTHH:mm"
                                  hint="The time the Nugget is published."
                                >
                                </q-time>

                                <div>
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
                                      scope.initialValue === scope.value
                                    "
                                  ></q-btn>
                                </div>
                              </template>
                            </q-popup-edit>
                          </span>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-3 inline-form-label">Expire:</div>
                        <div class="col-9 inline-form-value">
                          <span class="cursor-pointer">
                            <date-display
                              :rawDate="nuggetMap.get(nuggetId).unPubAt"
                              displayFormat="YYYY/MM/DD hh:mm a"
                              label="Expire At:"
                            ></date-display>
                            <q-icon
                              size="xs"
                              name="edit"
                              v-if="
                                !nuggetMap.get(nuggetId).unPubAt ||
                                nuggetMap.get(nuggetId).unPubAt < 1
                              "
                            ></q-icon>
                            <q-popup-edit
                              :model-value="nuggetMap.get(nuggetId).unPubAt"
                              auto-save
                              @save="
                                (v, iv) => {
                                  const isoDate = v + ':00.000Z';
                                  updateNuggetProp(
                                    nuggetId,
                                    'unPubAt',
                                    isoDate
                                  );
                                }
                              "
                            >
                              <template v-slot="scope">
                                <q-date
                                  dense
                                  v-model="scope.value"
                                  :model-value="scope.value"
                                  mask="YYYY-MM-DDTHH:mm"
                                  hint="The day the Nugget is removed from publication."
                                >
                                </q-date>
                                <q-time
                                  dense
                                  v-model="scope.value"
                                  :model-value="scope.value"
                                  mask="YYYY-MM-DDTHH:mm"
                                  hint="The time the Nugget is removed from publication."
                                >
                                </q-time>

                                <div>
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
                                      scope.initialValue === scope.value
                                    "
                                  ></q-btn>
                                </div>
                              </template>
                            </q-popup-edit>
                          </span>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-3 collection-item-label">Created:</div>
                        <div class="col-9 collection-item-value">
                          <date-display
                            :rawDate="nuggetMap.get(nuggetId).createdAt"
                            label="Created"
                          ></date-display>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-3 collection-item-label">Updated:</div>
                        <div class="col-9 collection-item-value">
                          <date-display
                            :rawDate="nuggetMap.get(nuggetId).updatedAt"
                            label="Updated"
                          ></date-display>
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-actions
                      align="center"
                      class="q-px-xl collection-item-actions"
                    >
                      <q-btn
                        class="subdued-btn"
                        v-on:click="confirmDeleteNugget(flowId, nuggetId)"
                        >Delete Nugget</q-btn
                      >
                    </q-card-actions>
                  </q-card>
                </q-expansion-item>

                <div class="row col-12">
                  <blocks-handler
                    :blockData="nuggetMap.get(nuggetId).blockData"
                    @save="(event) => saveBlocks(nuggetId, event)"
                  >
                  </blocks-handler>
                </div>
              </div>

              <!-- Button to trigger popup form to insert a Nugget between existing nuggets -->
              <div class="row col-12">
                <span class="col-4"></span
                ><span
                  class="col-4 text-center optional-form-header align-center"
                  @click="insertNugget(nuggetId)"
                  ><q-icon size="xs" name="add"></q-icon> Insert Nugget</span
                ><span class="col-4"></span>
              </div>
            </q-list>
          </template>
        </template>
      </q-list>
    </template>
    <template v-else> You must select a root directory </template>
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
} from "vue";

import { useQuasar, date } from "quasar";

import { useRoute } from "vue-router";

import useFlows from "../../composables/useFlows";

import NewNuggetForm from "../../components/flows/forms/NewNuggetForm";
import DateDisplay from "../../components/site/widgets/DateDisplay";
import BlocksHandler from "../../components/flows/blocks/BlocksHandler";
import NuggetTextProperty from "../../components/flows/forms/fields/NuggetTextProperty";

export default defineComponent({
  name: "PageFlow",
  emits: ["appNotification"],
  components: {
    NewNuggetForm,
    DateDisplay,
    BlocksHandler,
    NuggetTextProperty,
  },
  setup() {
    const route = useRoute();

    const {
      flowMap,
      loadFlow,
      flowLoaded,
      nuggetMap,
      updateNuggetProp,
      deleteNugget,
      createNugget,
      flowSource,
      nuggetSeqMap,
    } = useFlows();

    console.log(flowMap);
    console.log(nuggetMap);

    const flowId = computed(() => {
      return route.params.flowId;
    });

    const collectionFormOpen = ref(false);
    const collectionFormLabel = computed(() => {
      const label = collectionFormOpen.value ? "New Nugget Form" : "Add Nugget";
      return label;
    });
    // Include Quasar for dialog and loading indicator
    // @todo Move this to a component
    const $q = useQuasar();
    // Configure the loading indicator
    // https://quasar.dev/quasar-plugins/loading
    $q.loading.show({
      delay: 400, // ms
    });
    $q.loading.hide();

    const showLoading = () => {
      $q.loading.show({
        message: "Transporting nuggets...",
      });
    };

    const flow = computed(() => {
      return flowMap.get(flowId.value);
    });

    const saveBlocks = (nuggetId, blocks) => {
      updateNuggetProp(nuggetId, "blockData", blocks);
    };

    const insertNugget = (prevNugId) => {
      const timeStamp = Date.now();
      const formattedString = date.formatDate(
        timeStamp,
        "YYYY-MM-DD HH:mm:ss:SS"
      );
      const name = "Nugget - " + formattedString;
      const nugget = { name: name, title: "" };
      createNugget(flowId.value, nugget, prevNugId);
    };

    const editNuggetName = (nuggetId) => {
      console.log(nuggetId);
    };

    onMounted(async () => {
      loadFlow(flowId.value, true); // second param is `true` to return Nuggets in response
    });

    const nuggetSeq = computed(() => {
      return nuggetSeqMap.get(flowId.value);
    });

    return {
      flowLoaded,
      flow,
      nuggetMap,
      collectionFormLabel,
      collectionFormOpen,
      flowId,
      updateNuggetProp,
      deleteNugget,
      saveBlocks,
      insertNugget,
      editNuggetName,
      flowSource,
      //nuggetSeqMap,
      nuggetSeq,
    };
  },
  methods: {
    async confirmDeleteNugget(flowId, nuggetId) {
      this.$q
        .dialog({
          title: "Confirm Nugget Deletion",
          message: "Confirm or cancel deletion of this nugget.",
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteNugget(flowId, nuggetId);
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
