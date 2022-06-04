import { ref, reactive } from "vue";

import { nanoid } from "nanoid";

// Map of directory handles
const dirHandleMap = reactive(new Map());
// Map of file handles
const fileHandleMap = new Map();

const objDirs = { nugget: "nuggets", flow: "flows" };

export default () => {
  const setSource = async (dirHandle) => {
    dirHandleMap.set("sourceDir", dirHandle);
  };

  const loadFlows = async () => {
    try {
      console.log("Filesystem Flows");
      console.log(dirHandleMap);

      let flowDirHandle;
      // Get the flows directory handle
      if (dirHandleMap.has("flows")) {
        flowDirHandle = dirHandleMap.get("flows");
      } else {
        const sourceDirHandle = dirHandleMap.get("sourceDir");
        flowDirHandle = await sourceDirHandle.getDirectoryHandle("flows", {
          create: true,
        });
        dirHandleMap.set("flows", flowDirHandle);
      }

      console.log(flowDirHandle);
      const dirSegmentsArray = [];
      for await (const entry of flowDirHandle.entries()) {
        if (entry[1].kind === "directory") {
          const dirSegments = ["flows", entry[1].name, "flow"];
          dirSegmentsArray.push(dirSegments);
        }
      }

      // Check them all directories in parallel for a `flows.json`
      const flows = await getJsonMulti(dirSegmentsArray);

      return { flows: flows };
    } catch (e) {
      console.error("Error Loading Filesystem Flows");
      console.error(e);
    }
  };

  const getJsonMulti = async (dirSegmentsArray) => {
    const objects = [];

    await Promise.all(
      dirSegmentsArray.map(async (dirSegments) => {
        let readResult = {};

        try {
          readResult = await readJson(dirSegments);
          if (readResult) {
            objects.push(readResult);
          }
        } catch (e) {
          console.error(e);
        }
      })
    );

    return objects;
  };

  const readJson = async (pathSegments) => {
    try {
      const topDir = pathSegments[0];
      const objectDir = pathSegments[1];
      const filename = pathSegments[2];
      const fullName = filename + ".json";
      console.log("Reading " + fullName + " from " + objectDir);

      // The 2nd level directory, a Flow or Nugget ID
      let objectDirHandle;

      // If we already have a handle for the final object directory, use it.
      if (dirHandleMap.has(objectDir)) {
        objectDirHandle = dirHandleMap.get(objectDir);
      } else {
        // Else get the objectDir handle from the topDir handle.
        // Do we already have a handle for the topDir? (flows|nuggets)
        let topDirHandle;
        if (dirHandleMap.has(topDir)) {
          topDirHandle = dirHandleMap.get(topDir);
        } else {
          // Else fetch the topDir handle from the sourceDir handle.
          // We don't have access above the sourceDir.
          const sourceDirHandle = dirHandleMap.get("sourceDir");
          topDirHandle = await sourceDirHandle.getDirectoryHandle(topDir);
          dirHandleMap.set(topDir, topDirHandle);
        }
        objectDirHandle = await topDirHandle.getDirectoryHandle(objectDir);
      }

      // get the FILE handle from the objectDirHandle
      const jsonFileHandle = await objectDirHandle.getFileHandle(fullName);
      const jsonFile = await jsonFileHandle.getFile();
      const jsonData = await jsonFile.text();
      return JSON.parse(jsonData);
    } catch (e) {
      console.error(e);
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
      let flowsDirHandle;

      // Do we already have a handle for this ID?

      if (dirHandleMap.has("flows")) {
        flowsDirHandle = dirHandleMap.get("flows");
      } else {
        // Else fetch the topDir handle from the sourceDir handle.
        // We don't have access above the sourceDir.
        const sourceDirHandle = dirHandleMap.get("sourceDir");
        flowsDirHandle = await sourceDirHandle.getDirectoryHandle("flows");
      }
      // get the FILE handle from the objectDirHandle
      //const jsonFileHandle = await objectDirHandle.getFileHandle(fullName);
      console.log(flowsDirHandle);
      await flowsDirHandle.removeEntry(flowId, { recursive: true });
      dirHandleMap.delete(flowId);
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

      const partialData = { [propName]: propValue };

      const flow = await mergeUpdate(["flows", flowId, "flow"], partialData);

      console.log(flow);
      return flow;
    } catch (e) {
      console.log("Error Updating Flow");
      console.log(e);
    }
  };

  // Merge an update into a well named object file
  const mergeUpdate = async (pathSegments, partialData) => {
    try {
      // A guard to make sure the id in the object matches the ID provided
      delete partialData.id;

      // Updated the updatedAt timestamp
      setUpdatedAt(partialData);

      // The last segment is the file name, without the `.json` suffix.
      // The other segments are directories
      const fileName = pathSegments.pop();
      const fullFileName = fileName + ".json";
      // The file handle is stored with the parent directory appended to disambiguate.
      let parentDir = pathSegments[pathSegments.length - 1];
      const fileHandleName = parentDir + "-" + fileName;

      // The fileHandle we will read and write
      let fileHandle;

      // Do we already have the fileHandle?
      if (fileHandleMap.has(fileHandleName)) {
        fileHandle = fileHandleMap.get(fileHandleName);
      } else {
        // We need to get the fileHandle from the parent directory.
        // The parentDirectory may not have been loaded yet.
        // Recurse through the remaining pathSegments until we find a loaded one.
        // Eventually we'll get to the last segment which will be in the sourceDir.

        pathSegments.unshift("sourceDir");
        // Process the remaining pathSegments in reverse
        pathSegments.reverse();
        // Track the segments we process so we can
        const processedSegments = [];

        // Go up and down segments updating this until its final correct state.
        let parentDirHandle;
        let parentFound = false;

        while (!parentFound) {
          const segment = pathSegments.shift();
          console.log("up " + segment);
          // Directory names will be unique and match the dirHandleMap key exactly.

          if (dirHandleMap.has(segment)) {
            // We can get to the fileHandle from here, no need to process the remaining segments.
            parentFound = true;

            parentDirHandle = dirHandleMap.get(segment);
            console.log("FOUND PARENT " + segment);
            console.log(parentDirHandle);
            // We now need to recurse the processed segments to get back to the file parentDir.
            while (processedSegments.length > 0) {
              let nextLevel = processedSegments.shift();
              console.log("down " + nextLevel);
              parentDirHandle = await parentDirHandle.getDirectoryHandle(
                nextLevel
              );
              console.log(parentDirHandle);
              // Save the handle
              dirHandleMap.set(nextLevel, parentDirHandle);
            }
          } else {
            processedSegments.push(segment);
          }
        }

        fileHandle = await parentDirHandle.getFileHandle(fullFileName);

        console.log(fileHandle);
      }
    } catch (e) {
      console.error(e);
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
      const topDirHandle = dirHandleMap.get(handleName);

      console.log(topDirHandle);

      let objectDirHandle;

      // Ensure the objectDir exists within the topDir.
      // This object may or may not have been loaded previously.
      if (dirHandleMap.has(objectDir)) {
        objectDirHandle = dirHandleMap.get(objectDir);
      } else {
        objectDirHandle = await topDirHandle.getDirectoryHandle(objectDir, {
          create: true,
        });
        dirHandleMap.set(objectDir, objectDirHandle);
      }

      const writeHandle = await objectDirHandle.getFileHandle(fullName, {
        create: true,
      });

      const writable = await writeHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(jsonString);
      // Close the file and write the contents to disk.
      await writable.close();

      return fileData;
    } catch (e) {
      console.error(e);
      //reject({ status: "failure" });
    }
    //  });
  };

  // Initialize the chosen directory
  const initSource = async () => {
    try {
      const sourceDirHandle = dirHandleMap.get("sourceDir");

      // Create required directories
      const flowDirHandle = await sourceDirHandle.getDirectoryHandle("flows", {
        create: true,
      });
      dirHandleMap.set("flows", flowDirHandle);

      const nuggetDirHandle = await sourceDirHandle.getDirectoryHandle(
        "nuggets",
        {
          create: true,
        }
      );
      dirHandleMap.set("nuggets", nuggetDirHandle);

      console.log(dirHandleMap);
      return;
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
