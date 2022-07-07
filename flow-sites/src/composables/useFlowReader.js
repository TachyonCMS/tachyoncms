import { readonly, reactive, ref, computed } from "vue";

import { tcms } from "boot/axios";

// Fetch the Flow Sites Config from the defined flow.
const config =
  require("../tcms-config/nuggets/tcms-flow-sites-config/blocks.json").blocks[0]
    .data;
console.log(config);

// MAIN EXPORT FUNCTION
export default function useFlowReader() {
  const title = ref("great things loading...");

  // The current flowId
  const flowId = ref();

  // Is any flow data loaded?
  const flowLoaded = ref(false);

  const loadFlowData = async (fId) => {
    console.log("Fetching data for flow: " + fId);

    // Get the flow.json to get the title
    const flowDataRes = await tcms.get("/flows/" + fId + "/flow.json");
    const flowData = flowDataRes.data;
    console.log(flowData);
    // Get the nugget seq so we can start loading nuggets
    // const  = await tcms.get("/flows/" + flowId + "/nuggetSeq.json").data;

    let nuggetSeqRes = await tcms.get("/flows/" + fId + "/nuggetSeq.json");
    let nuggetSeq = nuggetSeqRes.data.nuggetSeq;
    console.log(nuggetSeq);

    const nuggets = await Promise.all(
      nuggetSeq.map(async (nuggetId) => {
        try {
          console.log(nuggetId);
          const nuggetRes = await tcms.get(
            "/nuggets/" + nuggetId + "/nugget.json"
          );
          const blocksRes = await tcms.get(
            "/nuggets/" + nuggetId + "/blocks.json"
          );
          const nugget = nuggetRes.data;
          nugget.blocks = blocksRes.data.blocks;
          console.log(nugget);
          return nugget;
        } catch (e) {
          console.error(e);
        }
      })
    );

    flowData.nuggets = nuggets;

    console.log(flowData);

    return flowData;
  };

  const getHostSiteFlow = (hostName) => {
    console.log(hostName);
    console.log(config);
    const hostSite = config.hostSites[hostName];
    console.log(hostSite);
    const siteFlowId = config.siteFlows[hostSite];
    console.log(siteFlowId);
    return siteFlowId;
  };

  // Lookup for - Given a siteName find the primary hostname
  //const siteHost = {};
  //for (var hostName in hostSite) {
  //  siteHost[hostSite[hostName]] = hostName;
  //}

  return {
    flowLoaded,
    loadFlowData,
    getHostSiteFlow,
    title,
  };
}
