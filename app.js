const express = require("express");

const app = express();
const { getTopic } = require("./controllers/topic.controllers");

app.use(express.json());

app.get("/api/topics", getTopic);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({msg: "Internal Server Error"});
});

module.exports = app;
