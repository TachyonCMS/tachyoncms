<template>
  <q-page>
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
        <!-- Reactive list of Nuggets from within the Flow object. -->
        <q-list v-for="nuggetId in flow.nuggetSeq" :key="nuggetId">
          <q-expansion-item
            expand-icon-toggle
            icon="mdi-book-edit"
            header-class="text-h6 collection-item-header center"
            :label="nuggetMap.get(nuggetId).name"
          >
            <q-card>
              <q-card-section class="collection-item-body">
                <div class="row">
                  <div class="col-3 collection-item-label">ID:</div>
                  <div class="col-9 collection-item-value">
                    {{ nuggetMap.get(nuggetId).id }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 collection-item-label">Name:</div>
                  <div class="col-9 collection-item-value">
                    <span class="cursor-pointer">
                      {{ nuggetMap.get(nuggetId).name }}
                      <q-icon
                        size="xs"
                        name="edit"
                        v-if="
                          !nuggetMap.get(nuggetId).name ||
                          nuggetMap.get(nuggetId).name.length < 1
                        "
                      ></q-icon>
                      <q-popup-edit
                        v-model="nuggetMap.get(nuggetId).name"
                        :validate="(val) => val.length > 0"
                        @save="
                          (v, iv) => {
                            updateNuggetProp(
                              flowId,
                              nuggetMap.get(nuggetId).id,
                              'name',
                              v
                            );
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
                                  scope.validate(scope.value) === false ||
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
                <div class="row">
                  <div class="col-3 collection-item-label">Title:</div>
                  <div class="col-9 collection-item-value">
                    <span class="cursor-pointer">
                      {{ nuggetMap.get(nuggetId).title }}
                      <q-icon
                        size="xs"
                        name="edit"
                        v-if="
                          !nuggetMap.get(nuggetId).title ||
                          nuggetMap.get(nuggetId).title.length < 1
                        "
                      ></q-icon>
                      <q-popup-edit
                        v-model="nuggetMap.get(nuggetId).title"
                        @save="
                          (v, iv) => {
                            updateNuggetProp(
                              flowId,
                              nuggetMap.get(nuggetId).id,
                              'title',
                              v
                            );
                          }
                        "
                      >
                        <template v-slot="scope">
                          <q-input
                            autofocus
                            dense
                            v-model="scope.value"
                            :model-value="scope.value"
                            hint="Public title"
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
                                  scope.validate(scope.value) === false ||
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

                <div class="row">
                  <div class="col-3 collection-item-label">Publish:</div>
                  <div class="col-9 collection-item-value">
                    {{ nuggetMap.get(nuggetId).pubAt }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 collection-item-label">Expire:</div>
                  <div class="col-9 collection-item-value">
                    {{ nuggetMap.get(nuggetId).unPubAt }}
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
                  flat
                  v-on:click="deleteNugget(flowId, nuggetMap.get(nuggetId).id)"
                  >Delete</q-btn
                >
              </q-card-actions>
            </q-card>
          </q-expansion-item>

          <div class="nugget-container row col-12">
            <blocks-handler
              :blockData="nuggetMap.get(nuggetId).blockData"
              @save="(event) => saveBlocks(nuggetMap.get(nuggetId).id, event)"
            >
            </blocks-handler>
          </div>
        </q-list>
      </template>
    </q-list>
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

import { useQuasar } from "quasar";

import { useRoute } from "vue-router";

import useFlows from "../../composables/useFlows";

import NewNuggetForm from "../../components/flows/forms/NewNuggetForm";
import DateDisplay from "../../components/site/widgets/DateDisplay";
import BlocksHandler from "../../components/flows/blocks/BlocksHandler";

export default defineComponent({
  name: "PageFlow",
  emits: ["appNotification"],
  components: {
    NewNuggetForm,
    DateDisplay,
    BlocksHandler,
  },
  setup() {
    const route = useRoute();

    const {
      flowMap,
      loadFlow,
      flowLoaded,
      nuggetMap,
      createNugget,
      updateNuggetProp,
      deleteNugget,
    } = useFlows();

    console.log(nuggetMap);
    console.log(flowMap);

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

    onMounted(async () => {
      loadFlow(flowId.value, true); // second param is `true` to return Nuggets in response
    });

    return {
      flowLoaded,
      flow,
      nuggetMap,
      collectionFormLabel,
      collectionFormOpen,
      flowId,
      createNugget,
      updateNuggetProp,
      deleteNugget,
      saveBlocks,
    };
  },
});
</script>
