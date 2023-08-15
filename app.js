const express = require("express");
const app = express();
const { getTopic } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById } = require("./controllers/article.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopic);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
