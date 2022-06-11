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
      console.log("Filesystem loadFlows");
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
      //console.log("Reading " + fullName + " from " + objectDir);

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
      console.error(e);
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
      console.error(e);
    }
  };

  // Merge an update into a well named object file
  const mergeUpdate = async (pathSegments, partialData) => {
    try {
      // A guard to make sure the id in the object matches the ID provided
      delete partialData.id;

      // Updated the updatedAt timestamp
      setUpdatedAt(partialData);

      const fileHandle = await getFileHandle(pathSegments);

      // Read the current data
      const jsonFile = await fileHandle.getFile();
      const jsonData = await jsonFile.text();
      const existingData = JSON.parse(jsonData);

      // Merge partial data
      const mergedData = await { ...existingData, ...partialData };

      const jsonString = JSON.stringify(mergedData, null, 2);

      // Write merged data back to fileHandle
      const writable = await fileHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(jsonString);
      // Close the file and write the contents to disk.
      await writable.close();

      return mergedData;
    } catch (e) {
      console.error(e);
    }
  };

  const getDirFiles = async (dirHandle, extensions = "*") => {
    // Get entries for the dirHandle
    const dirFiles = [];

    for await (const entry of dirHandle.entries()) {
      console.log(entry);
      if (entry[1].kind === "file") {
        dirFiles.push(entry[1].name);
      }
    }

    // Filter out directories and files that don't match the extension
    // Return the asset files
    return dirFiles;
  };

  const getFileHandle = async (pathSegments) => {
    try {
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

          // Directory names will be unique and match the dirHandleMap key exactly.

          if (dirHandleMap.has(segment)) {
            // We can get to the fileHandle from here, no need to process the remaining segments.
            parentFound = true;

            parentDirHandle = dirHandleMap.get(segment);

            // We now need to recurse the processed segments to get back to the file parentDir.
            while (processedSegments.length > 0) {
              let nextLevel = processedSegments.shift();
              parentDirHandle = await parentDirHandle.getDirectoryHandle(
                nextLevel
              );

              // Save the handle
              dirHandleMap.set(nextLevel, parentDirHandle);
            }
          } else {
            processedSegments.push(segment);
          }
        }

        // A file handle to read/write data
        fileHandle = await parentDirHandle.getFileHandle(fullFileName, {
          create: true,
        });

        return fileHandle;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFlowById = async (flowId, withNuggets = false) => {
    try {
      // Get the Flow
      const flow = await readJson(["flows", flowId, "flow"]);
      console.log(flow);

      // If not withNuggets, return only the base data
      // If with Nuggets, fetch the nuggets for this flow
      if (withNuggets) {
        try {
          // Get the Flow's nuggetSeq
          const nuggetSeqHandle = await getFileHandle([
            "flows",
            flowId,
            "nuggetSeq",
          ]);
          console.log(nuggetSeqHandle);

          const existingSeq = await readJsonHandle(nuggetSeqHandle);
          if (existingSeq) {
            const nuggetSeq = existingSeq.nuggetSeq;
            console.log(nuggetSeq);
            if (nuggetSeq) {
              // Set nuggetSeq in flow result
              flow.nuggetSeq = nuggetSeq;

              // Create an array of paths
              const filePaths = [];
              nuggetSeq.map((dirName) => {
                const pathSegments = ["nuggets", dirName, "nugget"];
                filePaths.push(pathSegments);
              });
              // Load those paths
              const nuggets = await getJsonMulti(filePaths);

              return { flow: flow, nuggets: nuggets };
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      return { flow: flow };
    } catch (e) {
      console.log("Error Loading Filesystem Flow: " + flowId);
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
        "Error Updating Filesystem FlowData: " + flowId + " " + dataType
      );
      console.error(e);
      return;
    }
  };

  /**
   * NUGGETS
   */
  const createNugget = async (flowId, nuggetObj, prevNuggetId) => {
    try {
      console.log("Creating Nugget for Flow " + flowId);

      // Set ID and initial timestamps
      addId(nuggetObj);
      initTimestamps(nuggetObj);

      const nugget = await writeJson(
        ["nuggets", nuggetObj.id, "nugget"],
        nuggetObj
      );

      // Create a nuggetSeq update object
      const seqObj = {
        objType: "flow",
        objId: flowId,
        dataElement: "nuggetSeq",
        insertVal: nuggetObj.id,
        relId: prevNuggetId,
        relType: "prev",
      };

      let newSeq = await insertIntoSeq(seqObj);

      return { nugget: nugget, nuggetSeq: newSeq };
    } catch (e) {
      console.error("Error Creating Filesystem Nugget");
      console.error(e);
    }
  };

  const updateNuggetProp = async (nuggetId, propName, propValue) => {
    try {
      console.log("Updating Nugget");
      console.log(propName);
      console.log(propValue);

      const partialData = { [propName]: propValue };

      const nugget = await mergeUpdate(
        ["nuggets", nuggetId, "nugget"],
        partialData
      );

      console.log(nugget);
      return { nugget: nugget };
    } catch (e) {
      console.log("Error Updating Nugget");
      console.error(e);
    }
  };

  // Delete Flow reference and Nugget
  const deleteNugget = async (flowId, nuggetId) => {
    try {
      let nuggetsDirHandle;

      // Do we already have a handle for this ID?

      if (dirHandleMap.has("nuggets")) {
        nuggetsDirHandle = dirHandleMap.get("nuggets");
      } else {
        // Else fetch the topDir handle from the sourceDir handle.
        // We don't have access above the sourceDir.
        const sourceDirHandle = dirHandleMap.get("sourceDir");
        nuggetsDirHandle = await sourceDirHandle.getDirectoryHandle("nuggets");
      }
      // get the FILE handle from the objectDirHandle
      //const jsonFileHandle = await objectDirHandle.getFileHandle(fullName);
      console.log(nuggetsDirHandle);
      await nuggetsDirHandle.removeEntry(nuggetId, { recursive: true });
      dirHandleMap.delete(nuggetId);

      const nuggetSeq = await delFromSeq("flow", flowId, "nuggetSeq", nuggetId);

      return { deleted: nuggetId, nuggetSeq: nuggetSeq };
    } catch (e) {
      console.log("Error Deleting Nugget");
      console.error(e);
    }
  };

  /**
   * SHARED}
   */
  const delFromSeq = async (objType, objId, dataElement, ixVal) => {
    console.log(
      "Deleting " +
        ixVal +
        " from " +
        dataElement +
        " for " +
        objType +
        " " +
        objId
    );
    // Determine the path of the target file
    const pathSegments = [objDirs[objType], objId, dataElement];

    // Get a fileHandle for that path.
    const fileHandle = await getFileHandle(pathSegments);

    // Read the current sequence from the fileHandle
    const currentSeq = await readJsonHandle(fileHandle);

    const newSeq = currentSeq.nuggetSeq.filter(function (value) {
      return value !== ixVal;
    });
    const writeResult = await writeJsonHandle(fileHandle, {
      nuggetSeq: newSeq,
    });

    // Return the new sequence
    return newSeq;
  };

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

  const insertIntoSeq = async (seqInput) => {
    try {
      // Breakup the input
      const { objType, objId, dataElement, insertVal, relId, relType } = {
        ...seqInput,
      };
      // Make the new sequence value into an array
      let newSeq = [insertVal];

      // Determine the path of the target file
      const pathSegments = [objDirs[objType], objId, dataElement];

      // Get a fileHandle for that path.
      const fileHandle = await getFileHandle(pathSegments);

      // Read the current sequence from the fileHandle
      const currentSeq = await readJsonHandle(fileHandle);

      if (currentSeq) {
        console.log("Current sequence found");
        // Determine insert index
        //if (relId ) {
        console.log("RelId: " + relId);
        // A related nuggetId was passed, the new one is positioned relative to it.
        if (relId === 0) {
          // The new nugget is either first or last in sequence
          switch (relType) {
            case "prev":
              // There is zero nugget previous. so this new nugget is first
              newSeq = [...newSeq, ...currentSeq.nuggetSeq];
              break;

            case "next":
              // There is no "next" nugget, the new nugget belongs on the end.
              newSeq = [...currentSeq.nuggetSeq, ...newSeq];
              break;
          }
        } else {
          // An existing item was provided.
          // It is either the prev or next, relative to the new one.
          let insertIx;
          console.log(relType);
          switch (relType) {
            case "prev":
              // The related nugget is previous. The new  nugget is immediately after it.
              insertIx = currentSeq.nuggetSeq.indexOf(relId) + 1;
              break;

            case "next":
              // The related nugget is "next", the new nugget belongs immediately before it.
              insertIx = currentSeq.nuggetSeq.indexOf(relId) + 1;
              break;
          }
          console.log(insertIx);
          newSeq = [
            ...currentSeq.nuggetSeq.slice(0, insertIx),
            ...newSeq,
            ...currentSeq.nuggetSeq.slice(insertIx),
          ];
        }
        // }
      }
      console.log(newSeq);
      // Write the new sequence out to same path
      const writeResult = await writeJsonHandle(fileHandle, {
        nuggetSeq: newSeq,
      });

      // Return the new sequence
      return newSeq;
    } catch (e) {
      console.error(e);
    }
  };

  const readJsonHandle = async (fileHandle) => {
    try {
      // Read the current data
      const jsonFile = await fileHandle.getFile();
      const jsonData = await jsonFile.text();
      console.log(jsonData);

      const existingData = JSON.parse(jsonData);

      return existingData;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const writeJsonHandle = async (fileHandle, jsonData) => {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      await writeToFileHandle(fileHandle, jsonString);
      return jsonData;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const writeToFileHandle = async (fileHandle, data) => {
    try {
      // Write merged data back to fileHandle
      const writable = await fileHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(data);
      // Close the file and write the contents to disk.
      await writable.close();
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const loadNuggetAssets = async (nuggetId) => {
    try {
      // The parentDir is "/nuggets/:nuggetId/assets"
      // Get the list of files from the parentDirHandle.
      const dirHandleName = "assets-" + nuggetId;
      const handleSegments = ["nuggets", nuggetId, dirHandleName];
      const dirHandle = await getDirHandle(handleSegments);
      console.log(dirHandle);
      const assets = await getDirFiles(dirHandle);
      console.log(assets);
      return assets;
    } catch (e) {
      console.log("Error Loading Filesystem Nugget Assets");
      console.error(e);
    }
  };

  const getDirHandle = async (pathSegments, create = true) => {
    try {
      // All pathSegments are directories.
      // All segment names should be 100% resolved and can be used as-is.

      // If the last segment doesn't exist we
      console.log(pathSegments);
      let isHandleFound = false;

      const processedSegments = [];

      const targetHandleName = pathSegments.pop();

      // If we already have the desired handle, return it.
      if (dirHandleMap.has(targetHandleName)) {
        return dirHandleMap.get(targetHandleName);
      }

      // Recurse up though pathSegments
      let parentDirName;
      let parentDirHandle;

      // Loop through remaining elements until we find one.
      while (!isHandleFound) {
        parentDirName = pathSegments.pop();
        console.log(parentDirName);
        if (dirHandleMap.has(parentDirName)) {
          isHandleFound = true;
          parentDirHandle = dirHandleMap.get(parentDirName);
          console.log(parentDirHandle);
        } else {
          processedSegments.push(parentDirName);
        }
      }

      // Recurse back though processedSegments
      // creating dirHandles until we get to our original target dir
      let childDirName;

      while (processedSegments.length > 0) {
        childDirName = processedSegments.pop();
        console.log(childDirName);
        parentDirHandle = await parentDirHandle.getDirectoryHandle(
          childDirName,
          { create: true }
        );
        dirHandleMap.set(childDirName, parentDirHandle);
        console.log(parentDirHandle);
      }

      const dirHandle = await parentDirHandle.getDirectoryHandle(
        targetHandleName,
        {
          create: true,
        }
      );

      console.log(dirHandle);
      return dirHandle;
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Flow reference and Nugget
  const deleteNuggetAsset = async (nuggetId, assetName) => {
    try {
      // Delete the asset
      const dirHandle = await getDirHandle([
        "nugget",
        nuggetId,
        "assets-" + nuggetId,
      ]);
      console.log(dirHandle);
      await dirHandle.removeEntry(assetName);
      return { deleted: assetName };
    } catch (e) {
      console.log("Error Deleting Nugget Asset");
      console.error(e);
    }
  };

  const storeNuggetAssets = async (nuggetId, files) => {
    try {
      // Get the Nugget asset dirHandle that all files will use.
      const dirHandle = await getDirHandle([
        "nugget",
        nuggetId,
        "assets-" + nuggetId,
      ]);

      const assets = ref([]);

      await Promise.all(
        files.map(async (file) => {
          console.log(file);

          const reader = new FileReader();

          reader.readAsArrayBuffer(file);

          reader.onload = function () {
            dirHandle
              .getFileHandle(file.name, { create: true })
              .then((handle) => {
                writeToFileHandle(handle, reader.result).then((result) => {
                  console.log(result);
                  console.log(file.name);
                  if (result === true) {
                    assets.value.push(file.name);
                  }
                });
              });
            console.log(reader.result);
          };
        })
      );
      console.log(assets.value);
      return { assetNames: assets.value };
    } catch (e) {
      console.log("Error Deleting Nugget Asset");
      console.error(e);
    }
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
    // getFlowNuggetSeqById,
    updateFlowData,
    checkAuth,
    loadNuggetAssets,
    deleteNuggetAsset,
    storeNuggetAssets,
  };
};
