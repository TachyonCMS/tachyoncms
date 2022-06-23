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
          data-cy="nuggets-new-nugget-form-toggle-btn"
        >
          <q-card class="no-margin full-height">
            <new-nugget-form
              :flowId="flowId"
              :condensed="true"
              class="collection-form-body"
              @closeForm="collectionFormOpen = false"
              dataCySlug="nuggets"
            ></new-nugget-form>
          </q-card>
        </q-expansion-item>
        <!-- END expansion form -->

        <!-- Show a spinner over the div if the flow hasn't finished loading. -->
        <template v-if="flowLoaded && nuggetSeq">
          <!-- Reactive list of Nuggets from within the Flow object. -->
          <q-list v-for="(nuggetId, nix) in nuggetSeq" :key="nuggetId">
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
                                  :disable="scope.initialValue === scope.value"
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
                                updateNuggetProp(nuggetId, 'unPubAt', isoDate);
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
                                  :disable="scope.initialValue === scope.value"
                                ></q-btn>
                              </div>
                            </template>
                          </q-popup-edit>
                        </span>
                      </div>
                    </div>

                    <nugget-text-property
                      label="Editor Override"
                      propName="editMode"
                      :propValue="nuggetMap.get(nuggetId).editMode"
                      :nuggetId="nuggetId"
                      hintText="Enable Editor.js mode"
                      :required="false"
                    ></nugget-text-property>

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

              <q-expansion-item
                header-class="collection-item-subheader text-center"
                :v-model="'nug-' + nuggetId + '-assets-toggle'"
                @show="loadNuggetAssets(nuggetId)"
              >
                <template #header>
                  <div>
                    <q-icon name="image" size="sm"></q-icon>
                  </div>
                  <q-space></q-space>
                  <div class="collection-item-subheader text-center">
                    Assets
                  </div>
                  <q-space></q-space>
                </template>
                <asset-manager :nuggetId="nuggetId"></asset-manager>
              </q-expansion-item>

              <div class="row col-12">
                <blocks-handler
                  :blocks="nuggetBlocksMap.get(nuggetId)"
                  @save="(event) => saveBlocks(nuggetId, event)"
                  :nix="nix"
                  v-if="nuggetMap.get(nuggetId).editMode != 'editor.js'"
                >
                </blocks-handler>

                <editorjs-blocks-handler
                  :blocks="nuggetBlocksMap.get(nuggetId)"
                  @save="(event) => saveBlocks(nuggetId, event)"
                  :nix="nix"
                  v-if="nuggetMap.get(nuggetId).editMode == 'editor.js'"
                >
                </editorjs-blocks-handler>
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
      </q-list>
    </template>
    <template v-else><NoFlowSourceSetPage></NoFlowSourceSetPage></template>
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
import EditorjsBlocksHandler from "../../components/flows/blocks/EditorjsBlocksHandler";
import NuggetTextProperty from "../../components/flows/forms/fields/NuggetTextProperty";
import NoFlowSourceSetPage from "../../pages/flows/NoFlowSourceSetPage";

import AssetManager from "../../components/flows/asset-manager/AssetManager";

export default defineComponent({
  name: "PageFlow",
  emits: ["appNotification"],
  components: {
    NewNuggetForm,
    DateDisplay,
    BlocksHandler,
    EditorjsBlocksHandler,
    NuggetTextProperty,
    NoFlowSourceSetPage,
    AssetManager,
  },
  setup() {
    const route = useRoute();

    const {
      flowMap,
      loadFlow,
      flowLoaded,
      nuggetMap,
      updateNuggetProp,
      updateNuggetData,
      deleteNugget,
      createNugget,
      flowSource,
      nuggetSeqMap,
      nuggetBlocksMap,
      loadNuggetAssets,
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
      updateNuggetProp(nuggetId, "blocks", blocks);
      updateNuggetData(nuggetId, "blocks", blocks);
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
      console.log("FLOWID: " + flowId.value);
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
      updateNuggetData,
      deleteNugget,
      saveBlocks,
      insertNugget,
      editNuggetName,
      flowSource,
      // nuggetSeqMap,
      nuggetSeq,
      loadNuggetAssets,
      nuggetBlocksMap,
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
