const path = require("path");
const fs = require("fs-extra");
const { nanoid } = require("nanoid");

const contentDataRootIx = process.argv.indexOf("--contentDataRoot");
let contentDataRoot;

if (contentDataRootIx > -1) {
  const contentDataRootIn = process.argv[contentDataRootIx + 1];
  contentDataRoot = path.resolve(contentDataRootIn);
}
console.debug("Managing content in " + contentDataRoot);

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

const getJsonMulti = async (dirSegmentsArray) => {
  const objects = [];

  await Promise.all(
    dirSegmentsArray.map(async (dirSegments) => {
      let readResult = {};

      try {
        readResult = await readJson(dirSegments);

        if (readResult.status === "success") {
          objects.push(readResult.data);
        }
      } catch (e) {
        console.error(e);
      }
    })
  );

  return objects;
};
/**
const ensureSubDir = async (contentDataRoot, subDir) => {
  const fullPath = contentDataRoot + osSep + subDir;
  try {
    if (existsSync(fullPath)) {
      return { lastLoadedAt: currentTime };
    }

    mkdirSync(fullPath);
  } catch (e) {
    return { error: "failed to create " + fullPath };
  }
};
 */
const readJson = async (pathSegments = []) => {
  return new Promise((resolve, reject) => {
    try {
      // Sandbox all file calls to the contentDataRoot
      pathSegments.unshift(contentDataRoot);

      const dirPath = path.resolve(...pathSegments);

      const fullPath = dirPath + ".json";

      fs.readFile(fullPath, "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          reject({ status: "failure" });
        } else {
          const parsedData = JSON.parse(fileData);
          resolve({ status: "success", data: parsedData });
        }
      });
    } catch (e) {
      console.error(e);
      reject({ status: "failure" });
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

      fs.mkdir(path.resolve(...pathDirs), { recursive: true }).then(() => {
        fs.writeFile(fullPath, jsonString).then(() => {
          resolve({ status: "success", data: fileData });
        });
      });
    } catch (e) {
      console.error(e);
      reject({ status: "failure" });
    }
  });
};

const getDirsIn = async (dirSegments) => {
  // Sandbox all file calls to the contentDataRoot
  dirSegments.unshift(contentDataRoot);

  // Resolve the fullPath
  const dirPath = path.resolve(...dirSegments);

  // All filesystem entries in that directory
  const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });

  // Filter out the directories.
  const dirs = dirEntries.filter((de) => de.isDirectory()).map((de) => de.name);

  return dirs;
};

const deleteDir = async (dirs = []) => {
  try {
    const dirPath = dirs.join(osSep);
    fs.rm(dirPath, { recursive: true }).then(() => {
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
const getFlowData = async (flowId, dataType) => {
  try {
    // Define valid types to scrub input
    const validDataType = ["flow", "nuggetSeq"];
    // Only load known types
    if (validDataType.includes(dataType)) {
      const pathSegments = ["flows", flowId, dataType];
      flow = await readJson(pathSegments);
      return flow;
    }
  } catch (e) {
    console.error(e);
    throw new Error("Invalid Request for " + flowId);
  }
};

// Merge an update into a well named object file
const mergeUpdate = async (objType, objId, partialData) => {
  // A guard to make sure the id in the object doesn't get used.
  delete partialData.id;

  // Updated the updatedAt timestamp
  setUpdatedAt(partialData);

  // All data requests are sandboxed to the root
  const pathSegments = [contentDataRoot, objDirs[objType], objId, objType];

  try {
    // Fetch current data
    const currentData = await readJson(pathSegments);
    // Merge old and new data
    const mergedData = { ...currentData.data, ...partialData };
    // Write the JSON file
    await writeJson(pathSegments, mergedData);
    return mergedData;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

// Create a new Nugget
const createNugget = async (data, flowIds = null) => {
  try {
    addId(data);
    initTimestamps(data);
    const pathSegments = ["nuggets", data.id, "nugget"];
    await writeJson(pathSegments, data);
    if (flowIds) {
      // Get a shared linkedAt datetime
      const nowStr = getNow();
      const linkedAt = { linkedAt: nowStr };

      // Add link in nugget to flow
      // Add link in flow to nugget
    }
    return data;
  } catch (e) {
    console.log("Failed to create Nugget");
    throw new Error("Unable to create Nugget " + data.id);
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
