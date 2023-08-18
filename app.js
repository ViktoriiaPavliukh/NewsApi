const express = require("express");
const app = express();
const { getTopic } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment
} = require("./controllers/article.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopic);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);


app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "404 Bad Request: Missing required properties" });
  } else {
    next(err);
  }
})


app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// app.use((err, req, res, next) => {
//   res.status(500).send({ msg: "Internal Server Error"});
// })

module.exports = app;
