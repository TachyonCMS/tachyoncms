<template>
  <q-page>
    {{ siteName }} {{ hostName }} {{ siteFlowId }}
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <h1>{{ flowData.title }}</h1>
      <template v-if="nuggets.length > 0">
        <!-- Reactive list of Nuggets from within the Flow object. -->

        <q-list v-for="nugget in nuggets" :key="nugget.id">
          <div class="nugget-container row col-12">
            <render-blocks :blocks="nuggetBlocksMap.get(nugget.id)">
            </render-blocks>
          </div>
        </q-list>
      </template>
    </template>
    <template v-else>
      <q-inner-loading :showing="true">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from "vue";

import { useQuasar, useMeta } from "quasar";

import { tcms } from "boot/axios";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";

// Lookup for - Given a hostname find the siteName
const hostSite = {
  "www.bikemechanic.info": "bikemechanic",
  "www.ezvegetarian.com": "ezvegetarian",
  "www.financeaproperty.com": "financeaproperty",
  "www.netrealestateguide.com": "netrealestateguide",
  "www.opensourcebike.com": "opensourcebike",
  "www.tachyoncms.com": "tachyoncms-com",
  "www.etownmall.com": "etownmall",
  "etownmall.com": "etownmall",
  "bikemechanic.info": "bikemechanic",
  "ezvegetarian.com": "ezvegetarian",
  "financeaproperty.com": "financeaproperty",
  "netrealestateguide.com": "netrealestateguide",
  "opensourcebike.com": "opensourcebike",
  "tachyoncms.com": "tachyoncms-com",
  localhost: "dev",
};

// Lookup for - Given a siteName find the primary hostname
const siteHost = {};
for (var hostName in hostSite) {
  siteHost[hostSite[hostName]] = hostName;
}

// Lookup for - Given a siteName find the siteFlowId
const siteFlow = {
  bikemechanic: "vB8rP92DGg1kU7LqogQP1",
  ezvegetarian: "1s2JoMSbjxniL7xWDXwpq",
  financeaproperty: "91cyatdi4ge4SwhpA6pfa",
  netrealestateguide: "0rCDm5KE5ZH8wFCvnNOzz",
  opensourcebike: "uAe1K3b2Rg6EnndK6J2SO",
  "tachyoncms-com": "ETdq9r9QsWMFgEluXYi0Q",
  etownmall: "WlKGtMVcGlcmUXEtFGQsM",
  dev: "-YXeNVsNk9Y9e6sgbnFNi",
};

// Main export

export default defineComponent({
  name: "FlowSitesIndexPage",
  components: {
    RenderBlocks,
  },
  setup() {
    const hostName = computed(() => {
      return window.location.hostname;
    });

    const siteName = ref(null);
    const siteFlowId = ref(null);

    siteName.value = hostSite[hostName.value];
    siteFlowId.value = siteFlow[siteName.value];

    // Is any flow data loaded?
    const flowLoaded = ref(false);

    // The flow data
    const flowData = ref({});

    // Are nuggets being loaded? They may be loaded in batches on-demand.
    const nuggetsLoading = ref(false);

    // A sequenced array of nuggetIds
    const nuggetSeq = ref(null);

    // Reactive array of Nuggets
    const nuggets = ref([]);

    // A map of blocks by nuggetId
    const nuggetBlocksMap = reactive(new Map());

    const title = ref("fetching greatness...");
    // Fetch the JSON files for this flow and nuggets
    const fetchFlowData = (siteFlowId) => {
      console.log("Fetching data for flow: " + siteFlowId);

      // Get the flow.json to get the title
      tcms
        .get("/flows/" + siteFlowId + "/flow.json")
        .then((response) => {
          flowData.value = response.data;
          flowLoaded.value = true;
          title.value = response.data.title;
        })
        .catch((e) => {
          console.log(e);
        });

      // Get the nugget seq so we can start loading nuggets
      tcms
        .get("/flows/" + siteFlowId + "/nuggetSeq.json")
        .then((response) => {
          nuggetSeq.value = response.data.nuggetSeq;
          response.data.nuggetSeq.forEach((nuggetId) => {
            console.log("Fetching data for nugget: " + nuggetId);
            console.log(response.data.nuggetSeq);
            // Use Axios to fetch JSON files from app public directory
            tcms
              .get("/nuggets/" + nuggetId + "/nugget.json")
              .then((response) => {
                console.log(response.data);
                nuggets.value.push(response.data);

                tcms
                  .get("/nuggets/" + nuggetId + "/blocks.json")
                  .then((response) => {
                    console.log(response.data);
                    nuggetBlocksMap.set(nuggetId, response.data.blocks);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(nuggets.value);
    };

    onMounted(async () => {
      fetchFlowData(siteFlowId.value);
    });

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    return {
      hostName,
      siteName,
      siteFlowId,
      flowLoaded,
      flowData,
      nuggetSeq,
      nuggets,
      nuggetBlocksMap,
    };
  },
});
</script>
