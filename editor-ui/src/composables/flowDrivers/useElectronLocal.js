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
      const flows = await electronApi.getElectronFlows(rootDir.value);
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

      const result = await electronApi.writeJson(
        [rootDir.value, "flows", flowData.id],
        "flow",
        flowData
      );
      console.log(result);
      if (result.status === "success") {
        return { flow: result.data };
      }
      return result.status;
    } catch (e) {
      console.log("Error Creating Flow");
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
      console.log(e);
    }
  };

  const updateFlowProp = async (flowId, propName, propValue) => {
    try {
      console.log("Updating Flow");
      console.log(propName);
      console.log(propValue);

      // Fetch the current Flow
      const flowDataResult = await getFlowById(flowId, false);

      console.log(flowDataResult);
      const flowData = flowDataResult.flow;
      // Merge the change in
      flowData[propName] = propValue;

      // Update the modified date
      setUpdated(flowData);

      // Save the updated Object
      const result = await electronApi.writeJson(
        [rootDir.value, "flows", flowData.id],
        "flow",
        flowData
      );
      console.log(result);
      if (result.status === "success") {
        return { flow: result.data };
      }
      return result.status;
    } catch (e) {
      console.log("Error Updating Flow");
      console.log(e);
    }
  };

  const getFlowById = async (flowId, withNuggets = false) => {
    try {
      const flowResult = await electronApi.getElectronFlowById(
        rootDir.value,
        flowId
      );

      if (flowResult.status != "success") {
        return null;
      }

      const flow = flowResult.data;

      let out = null;

      if (withNuggets) {
        try {
          const sequencedIds = await getFlowNuggetSeqById(flowId);
          console.log(sequencedIds.nuggetSeq);
          if (sequencedIds.nuggetSeq) {
            flow.nuggetSeq = sequencedIds.nuggetSeq;

            const nugs = await electronApi.getJsonMulti(
              rootDir.value,
              "nugget",
              sequencedIds.nuggetSeq
            );
            console.log(nugs);
            //flow["nuggets"] = nugs;

            out = { flow: flow, nuggets: nugs };
          }
        } catch (e) {
          console.error(e);
        }
      }

      console.log(out);

      return out;
    } catch (e) {
      console.log("Error Loading Electron Flow: " + flowId);
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
      console.log(e);
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

  const createNugget = async (flowId, nugget, prevNuggetId) => {
    try {
      console.log("Creating Nugget for Flow " + flowId);

      // Set ID and initial timestamps
      addId(nugget);
      initTimestamps(nugget);

      const nuggetResult = await electronApi.writeJson(
        [rootDir.value, "nuggets", nugget.id],
        "nugget",
        nugget
      );

      if (nuggetResult.status === "success") {
        // Add to the related flow's nuggetSeq
        const seqResult = addToNuggetSeq(flowId, nuggetResult.id, prevNugId);

        // Create a structured result
        const result = { nugget: nuggetResult, ...seqResult };

        return result;
      }
    } catch (e) {
      console.error("Error Creating Electron Nugget");
      console.error(e);
    }
  };

  const updateNuggetProp = async (nuggetId, propName, propValue) => {
    try {
      console.log("Updating Nugget Prop");
      console.log(propName);
      console.log(propValue);
      // Fetch the current Data
      const dataResult = await electronApi.getElectronNuggetById(
        rootDir.value,
        nuggetId
      );

      console.log(dataResult);
      const currentData = dataResult.data;
      // Merge the change in
      currentData[propName] = propValue;

      // Update the modified date
      setUpdated(currentData);

      // Save the updated Object,
      const result = await electronApi.writeJson(
        [rootDir.value, "nuggets", currentData.id],
        "nugget",
        currentData
      );
      console.log(result);
      if (result.status === "success") {
        return result.data;
      }
      return result.status;
    } catch (e) {
      console.log("Error Updating Nugget " + nuggetId + " " + propName);
      console.log(e);
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
  };
};
