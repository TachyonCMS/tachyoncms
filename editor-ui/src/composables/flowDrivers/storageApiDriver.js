import { storageApi } from "boot/axios";

import { ref } from "vue";

const rootDir = ref(null);

export default () => {
  const setSource = async (dir) => {
    console.log(dir);
    rootDir.value = dir;
  };

  const checkAuth = async (flowSource) => {
    console.log(flowSource);
    try {
      console.log("Storage API Check Auth for " + flowSource.rootUrl);
      storageApi.defaults.baseURL = flowSource.rootUrl;
      storageApi.defaults.auth = {
        username: flowSource.apiLogin,
        password: flowSource.apiPassword,
      };

      const checkResult = await storageApi.get("/auth/check");
      console.log(checkResult);
      if (checkResult.data && checkResult.data.user) {
        return checkResult.data;
      }
      return;
    } catch (e) {
      console.log("Error Loading StorageAPI Flows");
    }
  };

  const loadFlows = async () => {
    try {
      console.log("Storage API Flows");
      const flows = await storageApi.get("/flows");
      console.log(flows);
      return flows.data;
    } catch (e) {
      console.log("Error Loading StorageAPI Flows");
    }
  };

  const createFlow = async (flowData) => {
    try {
      console.log("Creating Flow");
      const result = await storageApi.post("/flows", flowData);
      console.log(result);
      return result.data;
    } catch (e) {
      console.log("Error Creating Flow");
      console.log(e);
    }
  };

  const deleteFlow = async (flowId) => {
    try {
      console.log("deleteFlow " + flowId);

      const result = await storageApi.delete("/flows/" + flowId);
      console.log(result);
      return result.data;
    } catch (e) {
      console.log("Error Deleting Storage API Flow");
      console.log(e);
    }
  };

  const updateFlowProp = async (flowId, propName, propValue) => {
    try {
      console.log("Updating Flow");
      console.log(propName);
      console.log(propValue);
      const result = await storageApi.post("/flows/" + flowId, {
        [propName]: propValue,
      });
      console.log(result);
      return result.data;
    } catch (e) {
      console.log("Error Updating Flow");
      console.log(e);
    }
  };

  const getFlowById = async (flowId, withNuggets = false) => {
    try {
      let qs = "";

      if (withNuggets) {
        qs = "/?nuggets=1";
      }

      const flowResult = await storageApi.get("/flows/" + flowId + qs);

      console.log(flowResult);

      const flowData = flowResult.data;

      console.log(flowData);

      return flowData;
    } catch (e) {
      console.log("Error Loading Storage API Flow: " + flowId);
      console.log(e);
    }
  };

  const getNuggetArray = async (idArray) => {
    try {
    } catch (e) {
      console.log("Error Loading Electron Flow: " + flowId);
      console.log(e);
    }
  };

  const getFlowNuggetSeqById = async (flowId) => {
    try {
      let nuggetSeq = await storageApi.getFlowData(
        rootDir.value,
        flowId,
        "nuggetSeq"
      );

      if (!nuggetSeq) {
        nuggetSeq = { nuggetSeq: [] };
      }

      return nuggetSeq;
    } catch (e) {
      console.log("Error Loading Electron NuggetSeq: " + flowId);
      console.log(e);
    }
  };

  const updateFlowData = async (flowId, data, dataType) => {
    try {
      const updateResult = await storageApi.writeJson(
        [rootDir.value, "flows", flowId],
        dataType,
        data
      );

      if (updateResult.status === "success") {
        const out = {};
        out[dataType] = data;
        return out;
      }
    } catch (e) {
      console.log(
        "Error Updating Electron FlowData: " + flowId + " " + dataType
      );
      console.log(e);
      return;
    }
  };

  /**
   * NUGGETS
   */

  const getNuggetsByFlowId = async (flowId) => {
    try {
      const url = "/flows/" + flowId + "/nuggets";
      return api.get(url).then((response) => {
        return response.data;
      });
    } catch (e) {
      console.log("Error Loading Nuggets for Flow: " + flowId);
    }
  };

  const createNugget = async (flowId, nugget, prevNugId = null) => {
    try {
      console.log("Creating Nugget for Flow " + flowId);
      try {
        console.log("Creating Nugget");
        const postData = {
          flowId: flowId,
          nugget: nugget,
          prevNugId: prevNugId,
        };
        const result = await storageApi.post("/nuggets", postData);
        console.log(result);
        return result.data;
      } catch (e) {
        console.error("Error Creating Nugget");
        console.error(e);
      }
    } catch (e) {
      console.error("Error Creating API Storage Nugget");
      console.error(e);
    }
  };

  const updateNuggetProp = async (nuggetId, propName, propValue) => {
    try {
      console.log("Updating Nugget " + nuggetId);
      console.log(propName);
      console.log(propValue);
      const result = await storageApi.post("/nuggets/" + nuggetId, {
        [propName]: propValue,
      });
      console.log(result);
      return result.data;
    } catch (e) {
      console.log("Error Updating Nugget");
      console.log(e);
    }
  };

  // Delete Nugget and Flow references Nugget
  const deleteNugget = async (flowId, nuggetId) => {
    try {
      console.log("DELETE - Delete Nugget: " + nuggetId);
      const result = await storageApi.delete(
        "/flows/" + flowId + "/nuggets/" + nuggetId
      );
      console.log(result);
      return result.data;
    } catch (e) {
      console.log("Error Deleting Nugget");
      console.log(e);
    }
  };

  /**
   * SHARED}
   */

  // Add createdAt and modifiedAt timestamps
  const initTimestamps = (data) => {
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }
    data.updatedAt = "";
    return data;
  };

  // Set updatedAt timestamp
  const setUpdated = (data) => {
    data.updatedAt = new Date().toISOString();
    return data;
  };

  // Add id
  const addId = (data) => {
    data.id = nanoid();
    return data;
  };

  // exposed
  return {
    loadFlows,
    createFlow,
    deleteFlow,
    updateFlowProp,
    getFlowById,
    createNugget,
    updateNuggetProp,
    deleteNugget,
    setSource,
    getFlowNuggetSeqById,
    updateFlowData,
    checkAuth,
  };
};
