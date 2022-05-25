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

  createFlow: async (flow) => {
    try {
      const flowData = await createFlow(flow);
      return flowData;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  updateFlowProp: async (flowId, propName, propValue) => {
    try {
      const flowData = await mergeUpdate("flow", flowId, {
        [propName]: propValue,
      });
      return flowData;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
