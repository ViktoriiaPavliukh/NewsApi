const express = require("express");
const app = express();
const { getTopic } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment, 
  updateArticle  
} = require("./controllers/article.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopic);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "Bad Request: Missing required properties" });
  } else if (err.code === "23503") {
    res
      .status(404)
      .send({ msg: "404 Not found" });
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

module.exports = app;
