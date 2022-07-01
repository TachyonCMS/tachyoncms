<template>
  <q-page>
    <template v-if="flowSource">
      <!-- Show a spinner over the div if the flow hasn't finished loading. -->
      <template v-if="flowLoaded">
        <!-- Reactive list of Nuggets from within the Flow object. -->
        <template v-if="nuggetSeq && nuggetSeq.length > 0">
          <q-list v-for="(nuggetId, nix) in nuggetSeq" :key="nuggetId">
            <div class="nugget-container">
              <div class="row collection-item-header">
                <q-btn icon="mdi-plus" flat padding="xs"
                  ><q-tooltip>Add Nugget</q-tooltip
                  ><q-menu>
                    <q-list dense>
                      <q-item clickable>
                        <q-item-section avatar>
                          <q-icon name="mdi-format-text"></q-icon>
                        </q-item-section>
                        <q-item-section>Editor</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right"></q-icon>
                        </q-item-section>

                        <q-menu anchor="top end" self="top start">
                          <q-list dense>
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                this.onCreateNugget(
                                  'editor',
                                  nuggetId,
                                  'before'
                                )
                              "
                            >
                              <q-item-section> Before </q-item-section>
                              <q-item-section avatar>
                                <q-icon name="mdi-arrow-up"></q-icon>
                              </q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                this.onCreateNugget('editor', nuggetId, 'after')
                              "
                            >
                              <q-item-section> After </q-item-section>
                              <q-item-section avatar>
                                <q-icon name="mdi-arrow-down"></q-icon>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                      <q-item clickable>
                        <q-item-section avatar>
                          <q-icon name="mdi-folder-multiple-image"></q-icon>
                        </q-item-section>
                        <q-item-section>Media</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right"></q-icon>
                        </q-item-section>

                        <q-menu anchor="top end" self="top start">
                          <q-list dense>
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                this.onCreateNugget('media', nuggetId, 'before')
                              "
                            >
                              <q-item-section> Before </q-item-section>
                              <q-item-section avatar>
                                <q-icon name="mdi-arrow-up"></q-icon>
                              </q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="
                                this.onCreateNugget('media', nuggetId, 'after')
                              "
                            >
                              <q-item-section> After </q-item-section>
                              <q-item-section avatar>
                                <q-icon name="mdi-arrow-down"></q-icon>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list> </q-menu
                ></q-btn>

                <q-btn icon="mdi-dots-vertical" flat padding="xs"
                  ><q-tooltip>Tune</q-tooltip
                  ><q-menu
                    ><q-btn
                      icon="mdi-arrow-up"
                      padding="sm"
                      flat
                      @click="this.moveNugget('up', flowId, nuggetId)"
                    ></q-btn
                    ><q-btn
                      icon="mdi-delete"
                      padding="sm"
                      flat
                      @click="confirmDeleteNugget(flowId, nuggetId)"
                    ></q-btn
                    ><q-btn
                      icon="mdi-arrow-down"
                      padding="sm"
                      flat
                      @click="this.moveNugget('down', flowId, nuggetId)"
                    ></q-btn></q-menu
                ></q-btn>

                <q-btn icon="mdi-calendar-month" flat padding="xs"
                  ><q-menu>
                    <q-list style="min-width: 100px" dense>
                      <q-item>
                        <q-item-section
                          ><div class="row">
                            <div class="col inline-form-label">Publish:</div>
                            <div class="col inline-form-value">
                              <span class="cursor-pointer">
                                <date-display
                                  :rawDate="nuggetMap.get(nuggetId).pubAt"
                                  displayFormat="YYYY/MM/DD hh:mm a"
                                  label="Publish At"
                                ></date-display>
                                <q-icon
                                  size="xs"
                                  name="edit"
                                  v-if="
                                    !nuggetMap.get(nuggetId).pubAt ||
                                    nuggetMap.get(nuggetId).pubAt.length < 1
                                  "
                                ></q-icon>
                                <q-popup-edit
                                  :model-value="nuggetMap.get(nuggetId).pubAt"
                                  auto-save
                                  @save="
                                    (v, iv) => {
                                      const isoDate = v + ':00.000Z';
                                      updateNuggetProp(
                                        nuggetId,
                                        'pubAt',
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
                            </div></div
                        ></q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section
                          ><div class="row">
                            <div class="col inline-form-label">Expire:</div>
                            <div class="col inline-form-value">
                              <span class="cursor-pointer">
                                <date-display
                                  :rawDate="nuggetMap.get(nuggetId).unPubAt"
                                  displayFormat="YYYY/MM/DD hh:mm a"
                                  label="Expire At"
                                ></date-display>
                                <q-icon
                                  size="xs"
                                  name="edit"
                                  v-if="
                                    !nuggetMap.get(nuggetId).unPubAt ||
                                    nuggetMap.get(nuggetId).unPubAt.length < 1
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
                            </div></div
                        ></q-item-section>
                      </q-item>
                      <q-separator></q-separator>
                    </q-list> </q-menu
                ></q-btn>

                <q-btn
                  icon="mdi-file-multiple"
                  flat
                  padding="xs"
                  @click="toggleNuggetAssets(nuggetId)"
                  ><q-tooltip>Files</q-tooltip></q-btn
                >
                <!-- {{ nuggetMap }} {{ nuggetId }} -->
                <q-btn icon="mdi-information-outline" flat padding="xs">
                  <q-menu anchor="bottom left" fit class="q-pa-md">
                    <q-list style="min-width: 100px" dense>
                      <q-item>
                        <q-item-section
                          >ID:
                          <span class="text-weight-bold">{{
                            nuggetMap.get(nuggetId).id
                          }}</span></q-item-section
                        >
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Type:
                          <span class="text-weight-bold">
                            {{ nuggetMap.get(nuggetId).type }}</span
                          >
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section
                          >Created:
                          <span class="text-weight-bold">
                            <date-display
                              :rawDate="nuggetMap.get(nuggetId).createdAt"
                              label="Created"
                            ></date-display></span
                        ></q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section
                          >Updated:
                          <span class="text-weight-bold">
                            <date-display
                              :rawDate="nuggetMap.get(nuggetId).updatedAt"
                              label="Updated"
                            ></date-display></span
                        ></q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-space></q-space>

                <div
                  class="q-pt-xs q-pr-sm subdued-header text-italics text-caption"
                >
                  {{ nuggetMap.get(nuggetId).id }}
                </div>
              </div>

              <asset-manager
                :nuggetId="nuggetId"
                v-show="nuggetAssetStates.has(nuggetId)"
              ></asset-manager>

              <div class="row col-12">
                <blocks-handler
                  :blocks="nuggetBlocksMap.get(nuggetId)"
                  @save="(event) => saveBlocks(nuggetId, event)"
                  :nix="nix"
                  v-if="nuggetMap.get(nuggetId).type != 'editor'"
                >
                </blocks-handler>

                <editorjs-blocks-handler
                  :blocks="nuggetBlocksMap.get(nuggetId)"
                  @save="(event) => saveBlocks(nuggetId, event)"
                  :nix="nix"
                  v-if="nuggetMap.get(nuggetId).type == 'editor'"
                >
                </editorjs-blocks-handler>
              </div>
            </div>
          </q-list>
        </template>
        <template v-else>
          <!-- Display info on creating the first nugget-->
          <first-nugget-instructions
            @addNugget="
              (event) => this.createNugget(flowId, { type: event.type })
            "
          ></first-nugget-instructions>
        </template>
      </template>
      <template v-else>
        <!-- Show spinner-->
      </template>
    </template>
    <template v-else><NoFlowSourceSetPage></NoFlowSourceSetPage></template>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, reactive, onMounted } from "vue";

import { useQuasar, date } from "quasar";

import { useRoute } from "vue-router";

import useFlows from "../../composables/useFlows";

import DateDisplay from "../../components/site/widgets/DateDisplay";
import BlocksHandler from "../../components/flows/blocks/BlocksHandler";
import EditorjsBlocksHandler from "../../components/flows/blocks/EditorjsBlocksHandler";
//import NuggetTextProperty from "../../components/flows/forms/fields/NuggetTextProperty";
import NoFlowSourceSetPage from "../../pages/flows/NoFlowSourceSetPage";
import FirstNuggetInstructions from "../../pages/flows/FirstNuggetInstructions";

import AssetManager from "../../components/flows/asset-manager/AssetManager";

export default defineComponent({
  name: "PageFlow",
  emits: ["appNotification"],
  components: {
    DateDisplay,
    BlocksHandler,
    EditorjsBlocksHandler,
    //NuggetTextProperty,
    NoFlowSourceSetPage,
    AssetManager,
    FirstNuggetInstructions,
  },
  setup() {
    const route = useRoute();

    const dataCySlug = "nuggets";

    const nuggetAssetStates = reactive(new Map());

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
      moveNugget,
    } = useFlows();

    console.log(flowMap);
    console.log(nuggetMap);

    const flowId = computed(() => {
      return route.params.flowId;
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

    const insertNugget = (type, relNuggetId, relType) => {
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

    const toggleNuggetAssets = (nuggetId) => {
      if (nuggetAssetStates.get(nuggetId)) {
        nuggetAssetStates.delete(nuggetId);
      } else {
        nuggetAssetStates.set(nuggetId, true);
      }
    };

    return {
      flowLoaded,
      flow,
      nuggetMap,
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
      createNugget,
      dataCySlug,
      nuggetAssetStates,
      toggleNuggetAssets,
      moveNugget,
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
    async onCreateNugget(type, relId, relType) {
      console.log("Adding Nugget");

      const result = await this.createNugget(
        this.flowId,
        { type: type },
        relId,
        relType
      );
    },
  },
});
</script>
