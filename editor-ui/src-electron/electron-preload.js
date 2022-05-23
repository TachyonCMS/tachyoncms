const path = require("path");
const {
  promises,
  constants,
  access,
  existsSync,
  readFile,
  mkdirSync,
  unlinkSync,
  rmSync,
} = require("fs");
const { contextBridge } = require("electron");
import { dialog } from "@electron/remote";

const writeFileAtomic = require("write-file-atomic");

const osSep = path.sep;

const getNow = () => {
  return new Date().toISOString();
};

const getJsonMulti = async (rootDir, type, idArray) => {
  const objects = [];

  await Promise.all(
    idArray.map(async (objectId) => {
      console.log(objectId);
      let readResult = {};
      switch (type) {
        case "nugget":
          readResult = await readJson([rootDir, "nuggets", objectId], "nugget");
          break;
        case "flow":
          readResult = await readJson([rootDir, "flows", objectId], "flow");
          break;
      }

      if (readResult.status === "success") {
        objects.push(readResult.data);
        const event = new CustomEvent("flowLoaded", {
          bubbles: true,
          detail: readResult.data,
        });
      }
    })
  );

  console.log("getJsonMulti");
  console.log(objects);

  return objects;
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

const readJson = async (dirs = [], fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const dirPath = dirs.join(osSep);
      const fullPath = dirPath.replace(/\/+$/, "") + osSep + fileName + ".json";
      console.log("filedata for: " + fullPath);

      readFile(fullPath, "utf8", (err, fileData) => {
        if (err) {
          console.log("err - rejecting with failure");
          console.error(err);
          resolve({ status: "failure" });
        } else {
          const parsedData = JSON.parse(fileData);
          resolve({ status: "success", data: parsedData });
        }
      });
    } catch (e) {
      console.log(e);
      reject({ status: "failure" });
    }
  });
};

contextBridge.exposeInMainWorld("electronApi", {
  // Triggers an OS local file dialog and returns the selected directory.
  openDirectoryDialog: async (title, folder, filters) => {
    // calling showOpenDialog from Electron API: https://www.electronjs.org/docs/latest/api/dialog/
    const response = await dialog.showOpenDialog({
      title,
      filters,
      properties: ["openDirectory"],
    });
    //console.log("Directory selected: " + response.filePaths);
    return response.filePaths;
  },

  initRootDir: async (selectedDir) => {
    ensureSubDir(selectedDir, "flows");
    ensureSubDir(selectedDir, "nuggets");
  },

  dirAccessible: async (dirSegments) => {
    try {
      const dir = dirSegments.join(osSep);
      return new Promise((resolve, reject) => {
        access(dir, constants.R_OK | constants.W_OK, (error) => {
          resolve(!error);
        });
      });
    } catch (e) {
      console.log("ERROR: " + e);
      return false;
    }
  },

  getElectronFlows: async (rootDir) => {
    const flows = [];

    try {
      console.log("GET - All Flows from " + rootDir);

      // The parent directory that we expect to find Flows defined in sub-directories.
      const flowsDir = rootDir + osSep + "flows";

      const dirEntries = await promises.readdir(flowsDir, {
        withFileTypes: true,
      });

      const dirs = dirEntries
        .filter((de) => de.isDirectory())
        .map((de) => de.name);

      const fileFlows = await getJsonMulti(rootDir, "flow", dirs);

      //const flows = [...defaultFlows, ...fileFlows];

      return fileFlows;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  writeJson: async (dirs = [], fileName, fileData) => {
    try {
      const dirPath = dirs.join(osSep);
      console.log(dirPath);
      mkdirSync(dirPath, { recursive: true });
      const fullPath = dirPath + osSep + fileName + ".json";
      const jsonData = JSON.stringify(fileData, null, 2);
      return writeFileAtomic(fullPath, jsonData).then((err) => {
        if (err) {
          throw err;
        }

        return { status: "success", data: fileData };
      });
    } catch (e) {
      console.log(e);
      return {
        status: "error",
        error: "Failed to write: " + fullPath + ". " + e,
      };
    }
  },

  getElectronFlowById: async (rootDir, flowId) => {
    try {
      console.log("GET - Flow ID: " + flowId);

      // The parent directory that we expect to find Flows defined in sub-directories.
      const flowDir = rootDir + osSep + "flows" + osSep + flowId + osSep;

      try {
        const flow = readJson([flowDir], "flow");
        return flow;
      } catch (e) {
        console.log(e);
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  getElectronNuggetById: async (rootDir, nuggetId) => {
    try {
      console.log("GET - Nugget ID: " + nuggetId);

      // The parent directory that we expect to find Flows defined in sub-directories.
      const nuggetDir = rootDir + osSep + "nuggets" + osSep + nuggetId + osSep;

      try {
        const nugget = readJson([nuggetDir], "nugget");
        return nugget;
      } catch (e) {
        console.log(e);
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  getFlowData: async (rootDir, flowId, dataType) => {
    try {
      console.log("GET - FlowData for ID: " + flowId);

      // The parent directory that we expect to find Flows defined in sub-directories.
      const flowDir = rootDir + osSep + "flows" + osSep + flowId;

      const flowDataResult = await readJson([flowDir], dataType);
      if (flowDataResult.status != "success") {
        return null;
      }

      return flowDataResult.data;
    } catch (e) {
      console.log("ERROR CAUGHT");
      console.log(e);
    }
  },

  getJsonMulti: async (rootDir, type, idArray) => {
    const objects = [];

    await Promise.all(
      idArray.map(async (objectId) => {
        console.log(objectId);
        let readResult = {};
        switch (type) {
          case "nugget":
            readResult = await readJson(
              [rootDir, "nuggets", objectId],
              "nugget"
            );
            break;
          case "flow":
            readResult = await readJson([rootDir, "flows", objectId], "flow");
            break;
        }

        if (readResult.status && readResult.status === "success") {
          objects.push(readResult.data);
        }
      })
    );

    console.log("getJsonMulti");
    console.log(objects);

    return objects;
  },

  deleteJson: async (dirs = [], fileName, fileData) => {
    try {
      const dirPath = dirs.join(osSep);
      const fullPath = dirPath + osSep + fileName + ".json";
      unlinkSync(fullPath);

      return { status: "success", deleted: fullPath };
    } catch (e) {
      console.log(e);
      return { status: "failure" };
    }
  },

  deleteDir: async (dirs = []) => {
    try {
      const dirPath = dirs.join(osSep);
      rmSync(dirPath, { recursive: true });
      return { status: "success", deleted: dirPath };
    } catch (e) {
      console.log(e);
      return { status: "failure" };
    }
  },

  /* createSubDir: async (rootDir, subDir) => {
    // calling showOpenDialog from Electron API: https://www.electronjs.org/docs/latest/api/dialog/
    const fullPath = rootDir + osSep + subDir;
    try {
      const currentTime = getNow();

      if (existsSync(fullPath)) {
        return { lastLoadedAt: currentTime };
      }

      mkdirSync(fullPath);

      return { createdAt: currentTime };
    } catch (e) {
      return { error: "failed to create " + fullPath };
    }
  },
  getElectronFlows: async () => {
    try {
      console.log("GET - All Flows from ");
      console.log(rootDir);
      // The parent directory that we expect to find Flows defined in sub-directories.
      const flowsDir = rootDir + osSep + "flows" + osSep;

      const flows = ref([]);

      const dirEntries = readdirSync(flowsDir, { withFileTypes: true });

      const dirs = dirEntries
        .filter((de) => de.isDirectory())
        .map((de) => de.name);

      for (const flowId of dirs) {
        try {
          const fullPath = flowsDir + osSep + flowId + osSep + `flow.json`;
          const rawFlow = readFileSync(fullPath, "utf8");
          flows.value.push(JSON.parse(rawFlow));
        } catch (e) {
          console.log(e);
        }
      }
      console.log(flows.value);
      return flows;
    } catch (e) {
      console.log(e);
    }
  },
  writeFile: async (dirs = [], fileName, fileData) => {
    try {
      console.log(dirs);

      const dirPath = dirs.join(osSep);
      console.log(dirPath);
      mkdirSync(dirPath, { recursive: true });
      const fullPath = dirPath + osSep + "flow.json";
      writeFileSync(fullPath, JSON.stringify(fileData, null, 2));

      return { status: "success" };
    } catch (e) {
      console.log(e);
    }
  },
  */
});
