import { readonly, reactive, ref, computed, unref } from "vue";

import { date } from "quasar";

import { Platform } from "quasar";

import electronLocal from "./flowDrivers/electronLocalDriver";
import storageApi from "./flowDrivers/storageApiDriver";
import filesystemAccess from "./flowDrivers/filesystemAccessDriver";

// GLOBAL
// A map of Flows w/ ID as index.
const flowMap = reactive(new Map());

// A map of Nugget w/ ID as index.
const nuggetMap = reactive(new Map());

// An map of nuggetSeq by flowId
const nuggetSeqMap = reactive(new Map());

// An map of nugget assets by nuggetId
const nuggetAssetMap = reactive(new Map());

// An map of an array of blocks for a nugget by nuggetId
const nuggetBlocksMap = reactive(new Map());

// An array of sequenced Nugget Id's for a given flow.
const nuggetSeq = ref([]);

// The Flow currently being viewed.
// This can be used by the parent and siblings of the Page to display page data.
const pageFlowId = ref(null);

// The `type` of connection.
// storageApi|electron|amplifyApi
const flowConnector = ref(null);

// The level above Flows.
// In Electron it is the selected root dir.
// In the single-tenant app it has no meaning.
// In the SaaS app it is an Organization
const flowSource = ref(null);

// Set true to signal we finished loading the Flows and it is safe to display them.
const flowsLoaded = ref(false);

// Is the current flow loaded?
const flowLoaded = ref(false);

// MAIN EXPORT FUNCTION
export default function useFlows() {
  // Useful for list item label or button text
  // Displays truncated selection or propmt to select.
  const flowSourceMsg = computed(() => {
    let msg = "Invalid source, please refresh";
    switch (flowConnector.value) {
      case "electron":
        msg = dirLabel(flowSource.value);
        break;
      case "storageApi":
        msg = dirLabel(flowSource.value.nickname);
        break;
      case "filesystem":
        msg = "Local file system";
        break;
    }

    return msg;
  });

  const flowSourceDetail = computed(() => {
    let msg = "Invalid Source, please refresh";
    switch (flowConnector.value) {
      case "electron":
        msg = flowSource.value;
        break;
      case "storageApi":
        msg = flowSource.value.apiUsername + " @ " + flowSource.value.rootUrl;
        break;
      case "filesystem":
        msg = "Local filesystem";
        break;
    }

    return msg;
  });

  // Truncate a directory label.
  const dirLabel = (dir) => {
    // If less than 25 char use the whole dir
    if (dir && dir.length >= 25) {
      return "..." + dir.substr(-22, 22);
    }

    return dir;
  };

  // Connectors object, this does not need to be reactive
  const flowConnectors = {};

  // Load composable functions as connectors.
  // The key can be used as the _readModule and/or _writeModule
  if (Platform.is.electron) {
    flowConnectors.electron = electronLocal();
  }
  // Always load the storage API as an option
  flowConnectors.storageApi = storageApi();

  // Add filesystem support for Chrome browsers
  flowConnectors.filesystem = filesystemAccess();

  // Derive list of connector options from those loaded above
  const flowConnectorList = computed(() => {
    const connectors = [];

    for (const [key, value] of Object.entries(flowConnectors)) {
      connectors.push(key);
    }
    return connectors;
  });

  // Set the flowConnector
  const setFlowConnector = (newConnector) => {
    console.log("New flowConnector: " + newConnector);
    flowConnector.value = newConnector;
  };

  // Set the flowSource here and in driver
  const setFlowSource = (newSource) => {
    console.log("Set flowSource");
    flowSource.value = newSource;
    flowConnectors[flowConnector.value].setSource(newSource);
  };

  // Get all flows, @todo add pagination
  const loadFlows = async () => {
    console.info("Loading flows");
    try {
      if (flowConnector.value && flowSource.value) {
        flowConnectors[flowConnector.value].loadFlows().then((flows) => {
          if (flows) {
            flows.flows.map((key) => {
              flowMap.set(key.id, key);
            });
          }
          flowsLoaded.value = true;
        });
      }
    } catch (e) {
      console.error("Error Loading Flows");
      console.error(e);
    }
  };

  // Get a single Flow for display in the App page
  const loadFlow = async (flowId, withNuggets = false, withBlocks = true) => {
    try {
      if (flowConnector.value && flowSource.value) {
        // Use the defined connector
        return flowConnectors[flowConnector.value]
          .getFlowById(flowId, withNuggets, withBlocks)
          .then((flowData) => {
            console.log("FLOWDATA: ");
            console.log(flowData);
            const flow = flowData.flow;
            // Add the flow to the flowMap we use to list Flows.
            flowMap.set(flow.id, flow);

            if (flow.nuggetSeq) {
              nuggetSeqMap.set(flowId, flow.nuggetSeq);
            }

            if (flowData.nuggets) {
              console.log(flowData.nuggets);
              // Copy, then delete Nuggets from response
              const nuggets = flowData.nuggets;
              // Add each nugget to the nuggetMap
              nuggets.forEach((key) => {
                nuggetMap.set(key.id, key);
              });
              // Remove the nuggets array from flow
              delete flow.nuggets;
            }

            if (flowData.blocks) {
              console.log(flowData.blocks);
              // Copy, then delete Blocks from response
              Object.entries(flowData.blocks).forEach((entry) => {
                const [nuggetId, blocksArr] = entry;
                nuggetBlocksMap.set(nuggetId, blocksArr.blocks);
              });
              // Remove the nuggets array from flow
              delete flowData.blocksMap;
            }

            console.log(nuggetBlocksMap);

            // Signal the code Flows are loaded and it is safe to display them.
            flowLoaded.value = true;

            return flow;
          });
      }
    } catch (e) {
      console.error("Error Loading Flow: " + flowId);
      console.error(e);
    }
  };

  // Create a new Flow and persist it
  const createFlow = async (flowData) => {
    console.log(flowData);
    try {
      // Use the defined connector
      //await flowConnectors[flowConnector.value].setSource(flowSource.value);

      return flowConnectors[flowConnector.value]
        .createFlow(flowData)
        .then((flowResult) => {
          console.log(flowResult);
          flowMap.set(flowResult.flow.id, flowResult.flow);

          return flowResult.flow;
        });
    } catch (e) {
      console.error("Error Creating Flow");
      console.error(e);
    }
  };

  // Create a new Flow and persist it
  const createNugget = async (flowId, nuggetData, prevNugId = null) => {
    try {
      flowConnectors[flowConnector.value]
        .createNugget(flowId, nuggetData, prevNugId)
        .then((nuggetResult) => {
          console.log(nuggetResult);

          // Update the nugget data in nuggetMap
          nuggetMap.set(nuggetResult.nugget.id, nuggetResult.nugget);
          console.log(nuggetMap);

          // Update nuggetSeq in the app
          nuggetSeqMap.set(flowId, nuggetResult.nuggetSeq);
          console.log(nuggetSeqMap);

          return nuggetResult;
        });
    } catch (e) {
      console.error("Error Creating Nugget");
      console.error(e);
    }
  };

  // Delete a flow
  const deleteFlow = async (flowId) => {
    try {
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .deleteFlow(flowId)
        .then((flowResult) => {
          flowMap.delete(flowId);
        });
    } catch (e) {
      console.error("Error Deleting Flow");
      console.error(e);
    }
  };

  // Update a single property of a flow.
  // This is the predominate update mechanism when using inline editing.
  const updateFlowProp = async (flowId, propName, propValue) => {
    try {
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .updateFlowProp(flowId, propName, propValue)
        .then((flowResult) => {
          flowMap.set(flowId, flowResult);
        });
    } catch (e) {
      console.error("Error Updating Flow");
      console.error(e);
    }
  };

  // Update a single property of a nugget.
  // This is the predominate update mechanism when using inline editing.
  const updateNuggetProp = async (nuggetId, propName, propValue) => {
    try {
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .updateNuggetProp(nuggetId, propName, propValue)
        .then((nuggetResult) => {
          console.log(nuggetResult);
          nuggetMap.set(nuggetId, nuggetResult.nugget);
        });
    } catch (e) {
      console.error("Error Updating Nugget prop");
      console.error(e);
    }
  };

  // Update a single property of a nugget.
  // This is the predominate mechanism when the property has a lot of data.
  const updateNuggetData = async (nuggetId, propName, propValue) => {
    try {
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .updateNuggetData(nuggetId, propName, propValue)
        .then((result) => {
          console.log(result);
          nuggetBlocksMap.set(nuggetId, result.blocks);
        });
    } catch (e) {
      console.error("Error Updating Nugget data prop");
      console.error(e);
    }
  };

  // Delete a Nugget
  const deleteNugget = async (flowId, nuggetId) => {
    try {
      console.log("useFlows:deleteNugget " + flowId + " " + nuggetId);
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .deleteNugget(flowId, nuggetId)
        .then((delResult) => {
          console.log(delResult);
          // Delete from nuggetMap and seq
          nuggetSeqMap.set(flowId, delResult.nuggetSeq);
          nuggetMap.delete(nuggetId);
          // console.log(nuggetSeqMap);
        });
    } catch (e) {
      console.error("Error Deleting Flow");
      console.error(e);
    }
  };

  // Takes any object and uses pubAt and unPubAt props to determine if it is currently published.
  const isPublished = (object) => {
    let published = false;
    console.log(object);
    try {
      // If pubAt isn't set there is no way it is published
      if (object.pubAt) {
        // Now date object for comparing publication dates
        const nowDate = new Date();
        const nowDateId = nowDate.getTime(); // easy to compare representation of a date

        // The publication start date
        const startDate = new Date(object.pubAt);
        const startDateId = startDate.getTime();

        // If the start date is in the future it is not published, no further processing is needed.
        if (startDateId < nowDateId) {
          // If no unPubAt is set it is published indefinitely
          if (!object.unPubAt) {
            published = true;
          } else {
            // The publication end date
            const endDate = new Date(object.unPubAt);
            const endDateId = endDate.getTime();
            // If the end date is in the future it is published still
            if (endDateId > nowDateId) {
              published = true;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    return published;
  };

  const publishedNuggets = (flowId) => {
    const published = reactive(new Map());

    try {
      // Get the defined Nugget Sequence, which includes published and unpublished nuggets.
      const nuggetSeq = flowMap.get(flowId).nuggetSeq;

      // Loop through nuggetSeq and check each nugget to see if it is "inPublication".
      // If it is "inPublication", add iit to the published map.
      nuggetSeq.forEach((nuggetId) => {
        try {
          const nug = nuggetMap.get(nuggetId);
          if (isPublished(nug)) {
            published.set(nuggetId, nug);
          }
        } catch (e) {
          console.error(e);
        }
      });
    } catch (e) {
      console.error(e);
    }

    return published;
  };

  // Use publish dates to determine if currently published.
  const isInPublication = (pubAt, unPubAt = null) => {
    let inPublication = ref(false);

    const nowDate = new Date();
    const nDate = date.getDayIdentifier(nowDate);

    // To be published the following must be true:
    // pubAt must be defined
    if (pubAt) {
      // pubAt must resolve to a valid time
      try {
        // Use the pubAt date as the start date
        const fromDate = new Date(block.pubAt);
        const fDate = date.getDayIdentifier(fromDate);

        // If the fromDate is less than (before) nowDate it may be published.
        if (fDate < nDate) {
          // If there is no unPubDate it is published indefinitely
          if (!unPubAt) {
            inPublication.value = true;
          } else {
            const toDate = new Date(block.unPubAt);
            const tDate = date.getDayIdentifier(toDate);
            // If the toDate is greater than nowDate it is still in publication
            if (tDate > nDate) {
              inPublication.value = true;
            }
          }
        }
      } catch (e) {
        console.error(e);
        // default inPublication set above will be returned
      }
    }
    // If the unPubAt is not provided we assume it is in the future
    // If the unPubDate is in the past it is not in publication

    return inPublication;
  };

  // Get rid of all data from previous flowSource
  const flushAll = async () => {
    flowMap.clear();
    nuggetMap.clear();
    flowsLoaded.value = false;
    flowLoaded.value = false;
    pageFlowId.value = null;
    nuggetSeq.value = [];
  };

  const freshenData = async () => {
    await flushAll();
    loadFlows();
  };

  const checkAuth = async () => {
    try {
      console.log("Checking Source Auth for " + flowConnector.value);
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .checkAuth(flowSource.value)
        .then((checkResult) => {
          console.log(checkResult);
          return true;
        });
    } catch (e) {
      console.error("Error Checking Auth");
      console.error(e);
      return false;
    }
  };

  const initSource = async () => {
    try {
      console.log("Initializing source " + flowConnector.value);
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .initSource(flowSource.value)
        .then(() => {
          return;
        });
    } catch (e) {
      console.error("Error Checking Auth");
      console.error(e);
    }
  };

  const loadNuggetAssets = async (nuggetId, refresh = false) => {
    try {
      // Use the defined connector
      if (nuggetAssetMap.has(nuggetId) && !refresh) {
        return;
      }
      return flowConnectors[flowConnector.value]
        .loadNuggetAssets(nuggetId)
        .then((assets) => {
          console.log(assets);
          nuggetAssetMap.set(nuggetId, assets);
          return;
        });
    } catch (e) {
      console.error("Error Creating Nugget");
      console.error(e);
    }
  };

  // Delete a Nugget Asset
  const deleteNuggetAsset = async (nuggetId, assetName) => {
    try {
      console.log("useFlows:deleteNuggetAsset " + nuggetId + " " + assetName);
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .deleteNuggetAsset(nuggetId, assetName)
        .then((delResult) => {
          console.log(delResult);
          // Update the nuggetAssetMap for this nugget
          const currentAssets = nuggetAssetMap.get(nuggetId);
          console.log(currentAssets);
          const newAssets = currentAssets.filter((asset) => asset != assetName);
          console.log(newAssets);
          nuggetAssetMap.set(nuggetId, newAssets);
        });
    } catch (e) {
      console.error("Error Deleting Flow");
      console.error(e);
    }
  };

  const storeNuggetAssets = async (nuggetId, browserFiles) => {
    try {
      console.log("storeNuggetAsset " + nuggetId);
      // Use the defined connector
      flowConnectors[flowConnector.value]
        .storeNuggetAssets(nuggetId, browserFiles)
        .then((result) => {
          console.log(result);
          nuggetAssetMap.set(nuggetId, result);
        });
    } catch (e) {
      console.error("Error Storing Assets");
      console.error(e);
    }
  };

  return {
    loadNuggetAssets,
    loadFlows,
    flowsLoaded: readonly(flowsLoaded),
    flowLoaded: readonly(flowLoaded),
    flowMap,
    createFlow,
    deleteFlow,
    updateFlowProp,
    loadFlow,
    pageFlowId,
    createNugget,
    nuggetMap,
    updateNuggetProp,
    updateNuggetData,
    deleteNugget,
    nuggetSeq,
    isPublished,
    publishedNuggets,
    flowConnector: computed(() => flowConnector.value),
    flowConnectorList,
    setFlowConnector,
    setFlowSource,
    initSource,
    flowSource,
    flowSourceMsg,
    flowSourceDetail,
    flushAll,
    freshenData,
    nuggetSeqMap,
    checkAuth,
    nuggetAssetMap,
    nuggetBlocksMap,
    deleteNuggetAsset,
    storeNuggetAssets,
  };
}
