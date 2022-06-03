const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const writeFileAtomic = require("write-file-atomic");

// OS specific path separator
const osSep = path.sep;

// Map object types to directory names for lookups
const objDirs = { nugget: "nuggets", flow: "flows" };

// Consistent "now" datetime
const getNow = () => {
  return new Date().toISOString();
};

// Add createdAt and modifiedAt timestamps
const initTimestamps = (data) => {
  if (!data.createdAt) {
    data.createdAt = new Date().toISOString();
  }
  data.updatedAt = "";
  return data;
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

const setContentDataRoot = (dir) => {
  console.log("Setting contentDataRoot to " + dir);
  contentDataRoot = dir;
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

const readJson = async (pathSegments = []) => {
  return new Promise((resolve, reject) => {
    try {
      // Sandbox all file calls to the contentDataRoot
      pathSegments.unshift(contentDataRoot);

      const dirPath = path.resolve(...pathSegments);

      const fullPath = dirPath + ".json";

      console.log("Reading from: " + fullPath);

      fs.readFile(fullPath, "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          resolve(null);
        } else {
          const parsedData = JSON.parse(fileData);
          resolve(parsedData);
        }
      });
    } catch (e) {
      console.error(e);
      resolve(null);
    }
  });
};

// Write a JSON file, all logic should have been applied before this.
const writeJson = async (pathSegments = [], fileData) => {
  return new Promise((resolve, reject) => {
    try {
      pathSegments.unshift(contentDataRoot);

      // The last segment is the file name, the remainder are directories
      const pathDirs = pathSegments.slice(0, pathSegments.length - 1);
      const segmentsPath = path.resolve(...pathSegments);

      const fullPath = segmentsPath + ".json";

      console.log("writing to: " + fullPath);

      const jsonString = JSON.stringify(fileData, null, 2);
      console.log(fileData);

      fs.promises
        .mkdir(path.resolve(...pathDirs), { recursive: true })
        .then(() => {
          writeFileAtomic(fullPath, jsonString).then((err) => {
            if (err) {
              throw err;
            }
            resolve(fileData);
          });
        });
    } catch (e) {
      console.error(e);
      reject({ status: "failure" });
    }
  });
};

const getDirsIn = async (dirSegments) => {
  console.log(dirSegments);
  // Sandbox all file calls to the contentDataRoot
  dirSegments.unshift(contentDataRoot);

  console.log(dirSegments);

  // Resolve the fullPath
  const dirPath = path.resolve(...dirSegments);

  // All filesystem entries in that directory
  const dirEntries = await fs.promises.readdir(dirPath, {
    withFileTypes: true,
  });

  // Filter out the directories.
  const dirs = dirEntries.filter((de) => de.isDirectory()).map((de) => de.name);

  return dirs;
};

const deleteDir = async (dirs = []) => {
  try {
    const dirPath = dirs.join(osSep);
    fs.promises.rm(dirPath, { recursive: true }).then(() => {
      return { status: "success", deleted: dirPath };
    });
  } catch (e) {
    console.log(e);
    return { status: "failure" };
  }
};

// Get all the flows found in the designated directory
const getAllFlows = async () => {
  // If we find any flows on disk we'll merge them this array
  const defaultFlows = [];

  // Get an array of directories within the flows directory
  const flowDirs = await getDirsIn(["flows"]);

  console.log(flowDirs);
  const flowFilePaths = [];

  flowDirs.map((dirName) => {
    const pathSegments = ["flows", dirName, "flow"];
    flowFilePaths.push(pathSegments);
  });

  const fileFlows = await getJsonMulti(flowFilePaths);

  const flows = [...defaultFlows, ...fileFlows];

  return flows;
};

// Create a new Flow
const createFlow = async (flow) => {
  try {
    addId(flow);
    initTimestamps(flow);

    const pathSegments = ["flows", flow.id, "flow"];
    await writeJson(pathSegments, flow);
    return flow;
  } catch (e) {
    console.log("Failed to create Flow");
  }
};

// Delete a Flow
// Deletes entire Flow directory, Nuggets are not deleted as hey may be shared.
// A script will delete unlinked nuggets async and out of band.
const deleteFlow = async (flowId) => {
  const targetDirs = [contentDataRoot, "flows", flowId];
  return deleteDir(targetDirs);
};

// Get a single Flow with its associated data
const getFlowData = async (flowId, dataType, withNuggets) => {
  try {
    const out = {};

    // Define valid types to scrub input
    const validDataType = ["flow", "nuggetSeq"];
    // Only load known types
    if (validDataType.includes(dataType)) {
      const pathSegments = ["flows", flowId, dataType];
      const flow = await readJson(pathSegments);
      out.flow = flow;

      if (withNuggets) {
        try {
          // Determine the path of the nuggetSequence file
          const pathSegments = ["flows", flowId, "nuggetSeq"];

          // Read the current sequence
          const currentSeq = await readJson(pathSegments);
          const nuggetSeq = currentSeq.nuggetSeq;

          // Set the sequence in the output
          out.flow.nuggetSeq = nuggetSeq;

          const filePaths = [];

          nuggetSeq.map((dirName) => {
            const pathSegments = ["nuggets", dirName, "nugget"];
            filePaths.push(pathSegments);
          });

          out.nuggets = await getJsonMulti(filePaths);
        } catch (e) {
          console.error(e);
        }
      }

      return out;
    }
  } catch (e) {
    throw new Error("Invalid Request for " + flowId);
    console.error(e);
  }
};

// Merge an update into a well named object file
const mergeUpdate = async (objType, objId, partialData) => {
  console.log(partialData);
  // A guard to make sure the id in the object matches the ID provided
  partialData.id = objId;

  // Updated the updatedAt timestamp
  setUpdatedAt(partialData);

  // All data requests are sandboxed to the root
  const pathSegments = [contentDataRoot, objDirs[objType], objId, objType];
  console.log(pathSegments);
  try {
    // Fetch current data
    const currentData = await readJson(pathSegments);
    if (currentData) {
      // Merge old and new data
      const mergedData = await { ...currentData, ...partialData };
      // Write the JSON file
      await writeJson(pathSegments, mergedData);
      return mergedData;
    }
    throw new Error("Unable to update data.");
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

// Create a new Nugget
const createNugget = async (data) => {
  try {
    const newNugget = data.nugget;
    addId(newNugget);
    initTimestamps(newNugget);
    const pathSegments = ["nuggets", newNugget.id, "nugget"];
    await writeJson(pathSegments, newNugget);

    const out = { nugget: newNugget };

    if (data.flowId) {
      out.flowId = data.flowId;
      // Add to the Flow's nuggetSeq
      //     ...but first determine if an index was provided
      //const nowStr = getNow();
      ///const linkedAt = { linkedAt: nowStr };
      // Add link in nugget to flow
      // Add link in flow to nugget

      const nuggetId = newNugget.id;

      const seqInput = {
        objType: "flow",
        objId: out.flowId,
        dataElement: "nuggetSeq",
        insertVal: nuggetId,
        relId: data.prevNuggetId,
        relType: "prev",
      };
      console.log(seqInput);
      out.nuggetSeq = await insertIntoSeq(seqInput);
    }
    return out;
  } catch (e) {
    console.log("Failed to create Nugget");
    throw new Error("Unable to create Nugget");
  }
};

const getNugget = async (nuggetId) => {
  const pathSegments = ["nuggets", nuggetId, "nugget"];
  return await readJson(pathSegments);
};

const insertIntoSeq = async (seqInput) => {
  try {
    // Breakup the input
    const { objType, objId, dataElement, insertVal, relId, relType } = {
      ...seqInput,
    };

    // Determine the path of the target file
    const pathSegments = [objDirs[objType], objId, dataElement];

    // Read the current sequence
    const currentSeq = await readJson(pathSegments);
    console.log(currentSeq);

    let newSeq = [insertVal];

    if (currentSeq) {
      console.log("Current sequence found");
      console.log(currentSeq.nuggetSeq);
      // Determine insert index
      if (relId || relId === 0) {
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
          newSeq = [
            ...currentSeq.nuggetSeq.slice(0, insertIx),
            ...newSeq,
            ...currentSeq.nuggetSeq.slice(insertIx),
          ];
        }
      }
    }
    console.log(newSeq);
    // Write the new sequence out to same path
    const writeResult = await writeJson(pathSegments, { nuggetSeq: newSeq });
    console.log(writeResult);
    // Return the new sequence
    return newSeq;
  } catch (e) {
    console.error(e);
  }
};

// Delete a Nugget
// Deletes entire Nugget directory, Nuggets are not deleted as hey may be shared.
// A script will delete unlinked nuggets async and out of band.
const deleteNugget = async (nuggetId) => {
  const targetDirs = [contentDataRoot, "nuggets", nuggetId];
  return deleteDir(targetDirs);
};

// Create two-way reference links between two objects
const twoWayLink = async (objType1, objId1, objType2, objId2) => {
  // Add link in obj1/type2 to id2
  await objLink(objType1, objId1, objType2, objId2);
  // Add link in obj2/type1 to id1
  await objLink(objType2, objId2, objType1, objId1);
};

// Create one direction link between two objects
const objLink = async (fromObjType, fromObjId, toObjType, toObjId) => {
  // Get a shared linkedAt datetime
  const nowStr = getNow();

  // Define the JSON object to be stored
  const storedObj = { linkedAt: nowStr };

  // Lookup the directory names used by the objects
  const fromDir = objDirs[fromObjType];
  const toDir = objDirs[toObjType];

  // Define the path to write the file.
  // The link is a property of the "from" object.
  // Therefore, the data gets stored in the "from" object type and id directory.
  // In a subdirectory based on  the "to" type.
  const writeDirs = [contentDataRoot, fromDir, fromObjId, toDir];

  // Use the linked object ID as the file name.
  // A directory scan will then provide a list of all linked ID.
  // The index files themselves don't need to be fetched in  most instances.
  const fileName = toObjId;
};

const ensureSubDir = async (rootDir, subDir) => {
  const fullPath = rootDir + osSep + subDir;
  try {
    if (existsSync(fullPath)) {
      return { lastLoadedAt: currentTime };
    }

    mkdirSync(fullPath);
  } catch (e) {
    return { error: "failed to create " + fullPath };
  }
};

const initRootDir = async (selectedDir) => {
  ensureSubDir(selectedDir, "flows");
  ensureSubDir(selectedDir, "nuggets");
};

const dirAccessible = async (dirSegments) => {
  try {
    const dir = dirSegments.join(osSep);
    return new Promise((resolve, reject) => {
      fs.promises.access(
        dir,
        fs.constants.R_OK | fs.constants.W_OK,
        (error) => {
          resolve(!error);
        }
      );
    });
  } catch (e) {
    console.log("ERROR: " + e);
    return false;
  }
};

//exports.osSep = osSep;
//exports.getNow = getNow;
//exports.initTimestamps = initTimestamps;
//exports.setUpdatedAt = setUpdatedAt;
//exports.addId = addId;
//exports.getJsonMulti = getJsonMulti;
//exports.ensureSubDir = ensureSubDir;
//exports.readJson = readJson;
//exports.getDirs = getDirs;
exports.getAllFlows = getAllFlows;
exports.createFlow = createFlow;
exports.mergeUpdate = mergeUpdate;
exports.deleteFlow = deleteFlow;
exports.getFlowData = getFlowData;
exports.createNugget = createNugget;
exports.deleteNugget = deleteNugget;
exports.getNugget = getNugget;
exports.ensureSubDir = ensureSubDir;
exports.dirAccessible = dirAccessible;
exports.osSep = osSep;
exports.setContentDataRoot = setContentDataRoot;
