const express = require("express");
const app = express();
const { getTopic } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopic);

module.exports = app;
