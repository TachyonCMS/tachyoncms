const express = require("express");
const cors = require("cors");
const serverRoutes = require("./routes.js");

const basicAuth = require("express-basic-auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  basicAuth({
    users: { admin: "TachyonCMS" },
  })
);

const port = process.env.PORT || 3333;

app.use(serverRoutes);

app.listen(port, () => {
  console.log("Local Content Server is live on port: " + port);
  console.log("http://localhost:" + port);
});
