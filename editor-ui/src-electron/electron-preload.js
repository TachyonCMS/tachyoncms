// Get the business logic functions from the lib
const {
  getAllFlows,
  createFlow,
  mergeUpdate,
  deleteFlow,
  getFlowData,
  createNugget,
  deleteNugget,
  getNugget,
  setContentDataRoot,
  dirAccessible,
  osSep,
} = require("../../shared/modules/tachyoncms-fs");

const { contextBridge } = require("electron");
import { dialog } from "@electron/remote";

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
    const selectedDir = response.filePaths;
    setContentDataRoot(selectedDir[0]);
    return selectedDir;
  },

  checkDirAccessible: async (dirSegments) => {
    return dirAccessible(dirSegments);
  },

  loadFlows: async (rootDir) => {
    try {
      console.log("GET - All Flows from " + rootDir);

      const flows = await getAllFlows();

      return flows;
    } catch (e) {
      console.log(e);
      return [];
    }
  },

  getElectronFlowById: async (flowId, withNuggets = false) => {
    try {
      console.log("GET - Flow ID: " + flowId);
      try {
        const flowData = await getFlowData(flowId, "flow", withNuggets);
        return flowData;
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
});
