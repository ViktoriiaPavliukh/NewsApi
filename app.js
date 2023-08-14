const express = require("express");

const app = express();
const { getTopic } = require("./controllers/topic.controllers");

app.get("/api/topics", getTopic);


module.exports = app;
