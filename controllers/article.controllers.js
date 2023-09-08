const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addComment, 
  checkUserExists, 
  updateArticleVotes, 
  deleteCommentById,
  getArticlesByTopic
} = require("../models/article.models");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  if (topic) {
    getArticlesByTopic(topic)
      .then((articles) => {
        res.status(200).send({
          articles: articles,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
  selectArticles()
    .then((articles) => {
      res.status(200).send({
        articles: articles,
      });
    }).catch((err) => {
      next(err);
    });
  }  
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(() => selectCommentsByArticleId(article_id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};


exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  checkUserExists(username)
    .then(() => {
      return addComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
 const { article_id } = req.params;
 const { votes } = req.body;

 if (typeof votes !== "number") {
   return next({ status: 400, msg: "Invalid input" });
 }
  updateArticleVotes(article_id, votes)
   .then((updatedArticle) => {
     res.status(200).send({ article: updatedArticle });
   })
   .catch((err) => { 
     next(err);
   });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
};

