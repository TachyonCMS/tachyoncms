//import { api } from "boot/axios";

import { ref } from "vue";

import { nanoid } from "nanoid";

const rootDir = ref(null);

export default () => {
  const setSource = async (dir) => {
    console.log(dir);
    rootDir.value = dir;
  };

  const loadFlows = async () => {
    try {
      console.log("Electron Flows");
      const flows = await electronApi.loadFlows(rootDir.value);
      return { flows: flows };
    } catch (e) {
      console.log("Error Loading Electron Flows");
    }
  };

  const createFlow = async (flowData) => {
    try {
      console.log("Creating Flow");

      // Set ID and initial timestamps
      addId(flowData);
      initTimestamps(flowData);

      const result = await electronApi.createFlow(flowData);
      console.log(result);
      return { flow: result };
    } catch (e) {
      console.error("Error Creating Flow");
      console.error(e);
    }
  };

  const deleteFlow = async (flowId) => {
    try {
      console.log("deleteFlow " + flowId);

      const result = await electronApi.deleteDir([
        rootDir.value,
        "flows",
        flowId,
      ]);
      console.log(result);
      if (result.status === "success") {
        return result.deleted;
      }
    } catch (e) {
      console.log("Error Deleting Electron Flow");
      console.error(e);
    }
  };

  const updateFlowProp = async (flowId, propName, propValue) => {
    try {
      console.log("Updating Flow");
      console.log(propName);
      console.log(propValue);
      const result = await electronApi.updateFlowProp(
        flowId,
        propName,
        propValue
      );
      console.log(result);
      return result;
    } catch (e) {
      console.log("Error Updating Flow");
      console.error(e);
    }
  };

  const getFlowById = async (flowId, withNuggets = false) => {
    try {
      return await electronApi.getElectronFlowById(flowId, withNuggets);
    } catch (e) {
      console.log("Error Loading Electron Flow: " + flowId);
      console.error(e);
    }
  };

  const getFlowNuggetSeqById = async (flowId) => {
    try {
      let nuggetSeq = await electronApi.getFlowData(
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
      console.error(e);
    }
  };

  const updateFlowData = async (flowId, data, dataType) => {
    try {
      const updateResult = await electronApi.writeJson(
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
      console.error(e);
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

  const createNugget = async (flowId, nugget, prevNuggetId) => {
    try {
      console.log("Creating Nugget for Flow " + flowId);

      // Set ID and initial timestamps
      addId(nugget);
      initTimestamps(nugget);

      const nugObj = {
        nugget: nugget,
        flowId: flowId,
        prevNuggetId: prevNuggetId,
      };

      const nuggetResult = await electronApi.createNugget(nugObj);

      return nuggetResult;
    } catch (e) {
      console.error("Error Creating Electron Nugget");
      console.error(e);
    }
  };

  const updateNuggetProp = async (nuggetId, propName, propValue) => {
    try {
      console.log("Updating Nugget " + nuggetId);
      console.log(propName);
      console.log(propValue);
      const result = await electronApi.updateNuggetProp(
        nuggetId,
        propName,
        propValue
      );
      console.log(result);
      return result;
    } catch (e) {
      console.log("Error Updating Flow");
      console.error(e);
    }
  };

  const getNuggetById = async (nuggetId) => {
    try {
      const result = await electronApi.readJson(
        [rootDir.value, "nuggets", nuggetId],
        "nugget"
      );
      console.log(result);

      if (result.status != "success") {
        return null;
      }

      return result.data;
    } catch (e) {
      console.log("Error Loading Nugget: " + nuggetId);
    }
  };

  // Delete Flow reference and Nugget
  const deleteNugget = async (flowId, nuggetId) => {
    try {
      console.log("Deleting Nugget: " + nuggetId);
      // URL on LCS for POST
      const url = "/flows/" + flowId + "/nuggets/" + nuggetId;

      // DELETE the data on the LCS
      return api.delete(url).then((response) => {
        console.log(response);
      });
    } catch (e) {
      console.log("Error Deleting Flow");
      console.error(e);
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
    const { customAlphabet } = require("nanoid");
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzu";
    const nanoid = customAlphabet(alphabet, 12);

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
  };
};
