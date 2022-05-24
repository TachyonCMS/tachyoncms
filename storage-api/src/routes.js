const express = require("express");
const router = express.Router();

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
} = require("../../shared/modules/tachyoncms-fs");

/**
 * ROUTER DEFINITION
 */

// Auth Check
router.get(
  "/auth/check",
  async (req, res) => {
    try {
      console.log("GET - Auth Status");
      res.setHeader("Content-Type", "application/json");
      res.json({ auth: req.auth.user });
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Failed to load Auth Check" });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Get a list of flows
// Returns an array of objects, much as a DynamoDB call would.
router.get(
  "/flows",
  async (req, res) => {
    try {
      console.log("GET - All Flows");
      const flows = await getAllFlows();
      res.setHeader("Content-Type", "application/json");
      res.json({ flows: flows });
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Failed to load flows" });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Create a new Flow
router.post(
  "/flows",
  async (req, res) => {
    try {
      console.log("POST - Create Flow");
      const flowData = req.body;
      const flowResult = await createFlow(flowData);
      res.json({ flow: flowResult });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Update an existing Flow, merge the existing data into the existing object.
router.post(
  "/flows/:flowId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      const partialData = req.body;
      const flowResult = await mergeUpdate("flow", flowId, partialData);
      res.json({ flow: flowResult });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Delete a Flow by ID
router.delete(
  "/flows/:flowId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      console.log("DELETE - Delete Flow: " + flowId);
      await deleteFlow(flowId);
      res.json({ deleted: flowId });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Get a Flow by ID
router.get(
  "/flows/:flowId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      const withNuggets = req.query.nuggets;
      console.log("GET - Get Flow: " + flowId);
      const flowResult = await getFlowData(flowId, "flow", true);
      res.json(flowResult);
    } catch (e) {
      console.error(e);
      res.status(404).send({ error: "Not Found" });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Create a new Nugget
router.post(
  "/nuggets",
  async (req, res) => {
    try {
      console.log("POST - Create Nugget");
      const data = req.body;
      const result = await createNugget(data);
      res.json(result);
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Update an existing Nugget, merge the existing data into the existing object.
router.post(
  "/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const nuggetId = req.params.nuggetId;
      const partialData = req.body;
      const result = await mergeUpdate("nugget", nuggetId, partialData);
      res.json({ nugget: result });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Return a single nugget
router.get(
  "/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const nuggetId = req.params.nuggetId;
      const result = await getNugget(nuggetId);
      res.json({ nugget: result });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Delete a Nugget by ID
router.delete(
  "/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const nuggetId = req.params.nuggetId;
      console.log("DELETE - Delete Nugget: " + nuggetId);
      await deleteNugget(nuggetId);
      res.json({ deleted: nuggetId });
    } catch (e) {
      console.error(e);
      throw new Error("Unable to process request");
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/* DEPRECATED (until needed)
// Update an existing Flow, expects the full new object definition
router.put(
  "/flows/:flowId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      console.log("PUT - Update Flow: " + flowId);
      const jsonString = JSON.stringify(req.body, null, 2);
      console.log(jsonString);
      await fs.writeFile(
        contentDataRoot + "/flows/" + flowId + "/flow.json",
        jsonString
      );
      res.json(req.body);
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);




/*
// Get a Flow by ID
router.get(
  "/flows/:flowId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      console.log("GET - Get Flow: " + flowId);

      const flow = await fs.readJson(
        contentDataRoot + "/flows/" + flowId + "/flow.json",
        "utf8"
      );
      res.json(flow);
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// NUGGETS

router.get(
  "/flows/:flowId/nuggets",
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    try {
      const flowId = req.params.flowId;
      console.log("GET - Get Nuggets for Flow: " + flowId);

      const dirname = path.resolve(
        contentDataRoot + "/flows/" + flowId + "/nuggets/"
      );
      const filenames = await fs.readdir(dirname);
      const nuggets = [];
      for (const filename of filenames) {
        const nugget = await fs.readJson(`${dirname}/${filename}`, "utf8");
        nuggets.push(nugget);
      }

      res.json({ nuggets: nuggets });
    } catch (e) {
      console.error(e);
      res.json({ nuggets: [] });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get(
  "/flows/:flowId/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      const nuggetId = req.params.nuggetId;
      console.log("GET - Get data for Nugget: " + nuggetId);

      const dirname = path.resolve(
        contentDataRoot + "/flows/" + flowId + "/nuggets/"
      );

      const filename = nuggetId + ".json";

      console.log(dirname);
      console.log(filename);

      const nugget = await fs.readJson(`${dirname}/${filename}`, "utf8");

      res.setHeader("Content-Type", "application/json");
      res.json({ nugget: nugget });
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post(
  "/flows/:flowId/nuggets",
  async (req, res) => {
    try {
      console.log("POST - Create Nugget: " + req.body.id);
      const flowId = req.params.flowId;
      const jsonString = JSON.stringify(req.body, null, 2);
      const nuggetDir = contentDataRoot + "/flows/" + flowId + "/nuggets/";

      try {
        await fs.ensureDir(nuggetDir);
      } catch (e) {
        console.log("Failed to create Flow directory: " + flowDir);
      }

      await fs.writeFile(nuggetDir + "/" + req.body.id + ".json", jsonString);
      res.json(req.body);
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.put(
  "/flows/:flowId/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      const nuggetId = req.params.nuggetId;
      console.log("PUT - Update Nugget: " + nuggetId);
      const jsonString = JSON.stringify(req.body, null, 2);
      console.log(jsonString);
      await fs.writeFile(
        contentDataRoot + "/flows/" + flowId + "/nuggets/" + nuggetId + ".json",
        jsonString
      );
      res.json(req.body);
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/flows/:flowId/nuggets/:nuggetId",
  async (req, res) => {
    try {
      const flowId = req.params.flowId;
      const nuggetId = req.params.nuggetId;
      console.log("DELETE - Delete Nugget: " + nuggetId);
      await fs.remove(
        contentDataRoot + "/flows/" + flowId + "/nuggets/" + nuggetId + ".json"
      );
      res.json({ deleted: nuggetId });
    } catch (e) {
      console.error(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
*/

module.exports = router;
