import { ref } from "vue";

import { nanoid } from "nanoid";

// The root handle
const sourceDirHandle = ref(null);
// The Flows directory handle
const flowDirHandle = ref(null);
// The Nuggets directory handle
const nuggetDirHandle = ref(null);

const dirHandles = ref({
  root: sourceDirHandle,
  flows: flowDirHandle,
  nuggets: nuggetDirHandle,
});

export default () => {
  const setSource = async (dirHandle) => {
    sourceDirHandle.value = dirHandle;
  };

  const loadFlows = async () => {
    try {
      console.log("Filesystem Flows");

      return { flows: flows };
    } catch (e) {
      console.log("Error Loading Filesystem Flows");
    }
  };

  const createFlow = async (flowData) => {
    try {
      console.log("Creating Flow");

      // Set ID and initial timestamps
      addId(flowData);
      initTimestamps(flowData);

      const result = await writeJson(["flows", flowData.id, "flow"], flowData);
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
      console.log("Error Deleting Filesystem Flow");
      console.log(e);
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
      console.log(e);
    }
  };

  const getFlowById = async (flowId, withNuggets = false) => {
    try {
      return await electronApi.getFilesystemFlowById(flowId, withNuggets);
    } catch (e) {
      console.log("Error Loading Filesystem Flow: " + flowId);
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
      console.log("Error Loading Filesystem NuggetSeq: " + flowId);
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
        "Error Updating Filesystem FlowData: " + flowId + " " + dataType
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

      const nugObj = {
        nugget: nugget,
        flowId: flowId,
        prevNuggetId: prevNuggetId,
      };

      const nuggetResult = await electronApi.createNugget(nugObj);

      return nuggetResult;
    } catch (e) {
      console.error("Error Creating Filesystem Nugget");
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
  const writeJson = async (pathSegments = [], fileData) => {
    // return new Promise((resolve, reject) => {
    try {
      // We need to save to a named directory handle

      const handleName = pathSegments[0];
      const objectDir = pathSegments[1];
      const filename = pathSegments[2];
      const fullName = filename + ".json";
      const jsonString = JSON.stringify(fileData, null, 2);

      console.log(
        "writing to: " + handleName + " " + objectDir + " " + fullName
      );

      // This provides access to the first subdirectory level access (flows|nuggets)
      const topDirHandle = dirHandles.value[handleName];

      console.log(topDirHandle);

      let objectDirHandle;

      // Ensure the objectDir exists within the topDir.
      // This object may or may not have been loaded previously.
      if (dirHandles.value.hasOwnProperty(objectDir)) {
        objectDirHandle = dirHandles.value[objectDir];
      } else {
        objectDirHandle = await topDirHandle.getDirectoryHandle(objectDir, {
          create: true,
        });
        dirHandles[objectDir] = objectDirHandle;
      }

      const writeHandle = await objectDirHandle.getFileHandle(fullName, {
        create: true,
      });

      const writable = await writeHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(jsonString);
      // Close the file and write the contents to disk.
      await writable.close();
    } catch (e) {
      console.error(e);
      //reject({ status: "failure" });
    }
    //  });
  };

  // Initialize the chosen directory
  const initSource = async () => {
    try {
      // Create required directories
      flowDirHandle.value = await sourceDirHandle.value.getDirectoryHandle(
        "flows",
        {
          create: true,
        }
      );
      nuggetDirHandle.value = await sourceDirHandle.value.getDirectoryHandle(
        "nuggets",
        {
          create: true,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Add createdAt and modifiedAt timestamps
  const initTimestamps = (data) => {
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }
    data.updatedAt = "";
    return data;
  };

  // Consistent "now" datetime
  const getNow = () => {
    return new Date().toISOString();
  };

  // Set updatedAt timestamp
  const setUpdatedAt = (data) => {
    data.updatedAt = new Date().toISOString();
    return data;
  };

  // Add id
  const addId = (data) => {
    data.id = nanoid();
    return data;
  };

  const checkAuth = () => {
    return { user: "localuser" };
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
    initSource,
    getFlowNuggetSeqById,
    updateFlowData,
    checkAuth,
  };
};
