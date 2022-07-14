<template>
  <q-page>
    <q-list>
      <template v-for="nuggetId in eventSeq" :key="nuggetId">
        <q-expansion-item
          expand-separator
          icon="mdi-calendar-text"
          :label="this.nuggetMap.get(nuggetId).title"
          :caption="nuggetId"
        >
          <q-card flat>
            <q-card-section>
              <div class="row">
                <div class="col-1">
                  <q-btn
                    icon="mdi-magnify"
                    @click="this.onToggleEvidence(nuggetId)"
                  ></q-btn
                  ><q-tooltip>View Evidence</q-tooltip>
                </div>

                <div class="col-10">
                  {{ this.nuggetMap.get(nuggetId).description }}
                </div>

                <div class="col-1"></div>
              </div>
              <div class="row" v-if="this.openEvidenceMap.has(nuggetId)">
                <div class="col-1">
                </div>

                <div class="col-10">
                  <file-manager :nuggetId="nuggetId"></file-manager>
                </div>

                <div class="col-1"></div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </template>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from "vue";

import useFlows from "../../../composables/useFlows";

import FileManager from "../../../components/flows/asset-manager/AMFiles";

export default defineComponent({
  name: "AssetManager",
  components: {
    FileManager
  },
  props: ["eventSeq"],
  setup(props) {
    console.log(props);

    const openEvidenceMap = reactive(new Map());

    const { nuggetMap, nuggetAssetMap, nuggetAssetMetaMap } = useFlows();

    onMounted(() => {});
    return { nuggetMap, nuggetAssetMap, nuggetAssetMetaMap, openEvidenceMap };
  },
  methods: {
    onToggleEvidence(nuggetId) {
      console.log('Toggle '+ nuggetId + ' evidence')
      if(this.openEvidenceMap.has(nuggetId)) {
        this.openEvidenceMap.delete(nuggetId)
      } else {
        this.openEvidenceMap.set(nuggetId, true)
      }
    }
  }
});
</script>
