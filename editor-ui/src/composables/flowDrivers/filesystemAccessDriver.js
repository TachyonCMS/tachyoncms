import { ref, reactive, toRef } from "vue";

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

  const getJsonMultiObj = async (dirSegmentsArray, segmentIx = -2) => {
    const objects = {};

    await Promise.all(
      dirSegmentsArray.map(async (dirSegments) => {
        let readResult = {};
        let objId = dirSegments.at(segmentIx);

        try {
          readResult = await readJson(dirSegments);
          if (readResult) {
            objects[objId] = readResult;
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

      // The actual file handle we need
      let fileHandle;

      // The unique name for the desired filehandle
      const fileHandleName = objectDir + "-" + filename;

      if (fileHandleMap.has(fileHandleName)) {
        fileHandle = fileHandleMap.get(fileHandleName);
      } else {
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
            topDirHandle = await sourceDirHandle.getDirectoryHandle(topDir, {
              create: true,
            });
            dirHandleMap.set(topDir, topDirHandle);
          }
          objectDirHandle = await topDirHandle.getDirectoryHandle(objectDir);
        }

        // get the FILE handle from the objectDirHandle
        fileHandle = await objectDirHandle.getFileHandle(fullName);
      }

      const jsonFile = await fileHandle.getFile();
      const jsonData = await jsonFile.text();
      return JSON.parse(jsonData);
    } catch (e) {
      console.error(e);
      return null;
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

  const getFlowById = async (
    flowId,
    withNuggets = false,
    withBlocks = true
  ) => {
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

              let nuggets = [];
              let blocks = [];

              try {
                // Create an array of paths
                const filePaths = [];
                nuggetSeq.map((dirName) => {
                  const pathSegments = ["nuggets", dirName, "nugget"];
                  filePaths.push(pathSegments);
                });
                // Load those paths
                nuggets = await getJsonMulti(filePaths);
              } catch (e) {
                console.error(e);
              }

              if (withBlocks) {
                try {
                  console.log("Loading Blocks");
                  const blockPaths = [];
                  // Get an array of file paths
                  nuggetSeq.map((dirName) => {
                    const pathSegments = ["nuggets", dirName, "blocks"];
                    blockPaths.push(pathSegments);
                  });
                  // Load those paths
                  console.log(blockPaths);
                  blocks = await getJsonMultiObj(blockPaths);
                  const outObj = {};
                  Object.entries(blocks).forEach((entry) => {
                    const [objId, blocksObj] = entry;
                    console.log(objId, blocksObj);
                    outObj[objId] = blocksObj.blocks;
                  });
                  console.log(outObj);
                } catch (e) {
                  console.error(e);
                }
              }

              return { flow: flow, nuggets: nuggets, blocks: blocks };
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
  const createNugget = async (
    flowId,
    nuggetObj,
    relId = null,
    relType = null
  ) => {
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
        relId: relId,
        relType: relType,
      };

      console.log(seqObj);

      let newSeq = await insertIntoSeq(seqObj);

      console.log(newSeq);

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

  const updateNuggetData = async (nuggetId, propName, propValue) => {
    try {
      console.log("Updating Nugget");
      console.log(propName);
      console.log(propValue);

      const partialData = { [propName]: propValue };

      const result = await writeJson(["nuggets", nuggetId, "blocks"], {
        blocks: propValue,
      });

      console.log(result);
      return result;
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

      const tagsDirHandle = await sourceDirHandle.getDirectoryHandle("tags", {
        create: true,
      });
      dirHandleMap.set("tags", tagsDirHandle);

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
      console.log(objType, objId, dataElement, insertVal, relId, relType);
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
            case "before":
              // There is zero nugget previous. so this new nugget is first
              newSeq = [...newSeq, ...currentSeq.nuggetSeq];
              break;

            case "after":
              // There is no "next" nugget, the new nugget belongs on the end.
              newSeq = [...currentSeq.nuggetSeq, ...newSeq];
              break;
          }
        } else {
          // An existing item was provided.
          // It is either the prev or next, relative to the new one.

          const relIx = currentSeq.nuggetSeq.indexOf(relId);
          // If the relatedIx ix zero and it comes after the new one, the new one will now be first.
          // So we shift it on with no hoopla
          console.log("Related IX: " + relIx);
          if (relIx === 0) {
            console.log("IXFIRST");
            console.log(newSeq);
            newSeq = [...newSeq, ...currentSeq.nuggetSeq];
          } else if (relIx === currentSeq.nuggetSeq.length) {
            console.log("IXFLAST");
            newSeq = [...newSeq, ...currentSeq.nuggetSeq];
          } else {
            console.log("IXMIDS");
            let insertIx;
            console.log("RelType: " + relType);

            switch (relType) {
              case "before":
                insertIx = relIx;
                break;

              case "after":
                insertIx = relIx + 1;
                break;
            }
            console.log(insertIx);
            newSeq = [
              ...currentSeq.nuggetSeq.slice(0, insertIx),
              ...newSeq,
              ...currentSeq.nuggetSeq.slice(insertIx),
            ];
          }
        }
        // }
      }
      console.log("newSeq");
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

  const moveNugget = async (direction, flowId, nuggetId) => {
    try {
      // Make the new sequence value into an array
      let newSeq = [nuggetId];

      // Determine the path of the target file
      const pathSegments = [objDirs["flow"], flowId, "nuggetSeq"];

      // Get a fileHandle for that path.
      const fileHandle = await getFileHandle(pathSegments);

      // Read the current sequence from the fileHandle
      const currentSeq = await readJsonHandle(fileHandle);

      if (currentSeq) {
        console.log("Current sequence found");
        // Determine insert index
        //if (relId ) {
        console.log("NuggetId: " + nuggetId);

        const currentIx = currentSeq.nuggetSeq.indexOf(nuggetId);
        let newIx;
        if (direction == "up") {
          newIx = currentIx - 1;
        } else if (direction == "down") {
          newIx = currentIx + 1;
        }

        // Get an array without the id being moved
        const filtered = currentSeq.nuggetSeq.filter(
          (nugId) => nugId != nuggetId
        );

        newSeq = [
          ...filtered.slice(0, newIx),
          ...newSeq,
          ...filtered.slice(newIx),
        ];

        console.log(newSeq);
        // Write the new sequence out to same path
        const writeResult = await writeJsonHandle(fileHandle, {
          nuggetSeq: newSeq,
        });

        // Return the new sequence
        return newSeq;
      }
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
      return await writable.close();
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
      const noTemps = assets.filter((asset) => {
        return asset.substring(asset.length - 7) != ".crswap";
      });
      return noTemps;
    } catch (e) {
      console.log("Error Loading Filesystem Nugget Assets");
      console.error(e);
    }
  };

  const getDirHandle = async (pathSegments) => {
    try {
      // All pathSegments are directories.
      // All segment names should be 100% resolved and can be used as-is.
      console.log(pathSegments);

      const targetHandleName = pathSegments[pathSegments.length - 1];

      // If we already have the desired handle, return it.
      if (dirHandleMap.has(targetHandleName)) {
        return dirHandleMap.get(targetHandleName);
      }

      console.log("dirHandle not found yet");

      // The top level dirHandle MUST exist or allow failure
      const topDirName = pathSegments.shift();
      let dirHandle = dirHandleMap.get(objDirs[topDirName]);
      console.log(dirHandle);
      // Keep things simple, work our way from top to bottom, most should be found quickly in the map.
      for (const segment of pathSegments) {
        if (dirHandleMap.has(segment)) {
          dirHandle = dirHandleMap.get(segment);
        } else {
          dirHandle = await dirHandle.getDirectoryHandle(segment, {
            create: true,
          });
          dirHandleMap.set(segment, dirHandle);
        }
      }

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

      await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          const writeFileHandle = await dirHandle.getFileHandle(file.name, {
            create: true,
          });
          console.log(writeFileHandle);

          reader.readAsArrayBuffer(file);
          reader.onload = async function () {
            console.log(reader.result);

            const writeResult = await writeToFileHandle(
              writeFileHandle,
              reader.result
            );
          };
        })
      );

      return await loadNuggetAssets(nuggetId);
    } catch (e) {
      console.log("Error Adding Nugget Assets");
      console.error(e);
    }
  };

  const storeNuggetMedia = async (nuggetId, fileName, fileData) => {
    try {
      // Get the Nugget asset dirHandle that all files will use.
      const dirHandle = await getDirHandle([
        "nugget",
        nuggetId,
        "assets-" + nuggetId,
      ]);
      console.log(dirHandle);
      console.log(fileData);

      const writeFileHandle = await dirHandle.getFileHandle(fileName, {
        create: true,
      });

      const base64 = await fetch(fileData);
      const blob = await base64.blob();

      const writeResult = await writeToFileHandle(writeFileHandle, blob);

      return { nuggetId, fileName };
    } catch (e) {
      console.log("Error Adding Nugget Assets");
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
    updateNuggetData,
    deleteNugget,
    setSource,
    initSource,
    // getFlowNuggetSeqById,
    updateFlowData,
    checkAuth,
    loadNuggetAssets,
    deleteNuggetAsset,
    storeNuggetAssets,
    storeNuggetMedia,
    moveNugget,
  };
};
