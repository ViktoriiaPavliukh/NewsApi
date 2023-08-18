const app = require("../app.js");
const request = require("supertest");
const { toBeSortedBy } = require("jest-sorted");
const endpoints = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("app", () => {
  describe("GET /api", () => {
    test("responds with status 200 and the documentation object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.endpoints).toEqual(endpoints);
        });
    });
  });
  describe("api/topics", () => {
    test("200: responds with an array of topic object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topics) => {
            expect(topics).toHaveProperty("description", expect.any(String));
            expect(topics).toHaveProperty("slug", expect.any(String));
          });
        });
    });
  });
  test("200: responds with an array of exactly 3 topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
      });
  });
  describe("api/articles", () => {
    test("200: responds with an array of articles object", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeInstanceOf(Array)
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
            "article_img_url",
            expect.any(String));
            expect(article).toHaveProperty(
            "comment_count",
            expect.any(String));
          });
        });
    });
    test("200: should return articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET:200 sends a single article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: `2020-07-09T18:11:00.000Z`,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("404: responds with a 404 error and an error message when a valod id which does not exist is given", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No article found for article_id: 999"
          );
        });
    });
    test("400: responds with a 400 and sends an error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-article-id")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid id");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
   test("200: should return an array of comments for the given article_id, sorted by created_at in descending order", () => {
     return request(app)
       .get("/api/articles/5/comments")
       .expect(200)
       .then(({ body: { comments } }) => {
         expect(comments).toBeInstanceOf(Array);
         expect(comments.length).toBe(2);
         comments.forEach((comment) => {
           expect(comment).toHaveProperty("comment_id", expect.any(Number));
           expect(comment).toHaveProperty("body", expect.any(String));
           expect(comment).toHaveProperty("article_id", expect.any(Number));
           expect(comment).toHaveProperty ("author",expect.any(String));
           expect(comment).toHaveProperty("votes", expect.any(Number));
           expect(comment).toHaveProperty("created_at", expect.any(String));
         });
         expect(comments).toBeSortedBy("created_at", { descending: true });
       });
    });
    test("200: responds with an empty array when no comments are found for the given article_id", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });

    test("400: responds with an error message when given an invalid article_id", () => {
      return request(app)
        .get("/api/articles/not-an-article/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid id");
        });
    });
    test("404: responds with an error message when given a non-existent article_id", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No article found for article_id: 1000"
          );
        });
    });
  });
describe("POST api/articles/:article_id/comments", () => {
  test("201: responds with the new comment when all properties are provided", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a new comment.",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          article_id: 7,
          body: "This is a new comment.",
          author: "icellusedkars"
        });
      });
    });
  }); 
  test("201: ignores extra properties and responds with the new comment", () => {
    const newCommentWithExtras = {
      username: "icellusedkars",
      body: "This is a new comment.",
      randomKey: "ignore me",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newCommentWithExtras)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          article_id: 7,
          body: "This is a new comment.",
          author: "icellusedkars",
        });
      });
  }); 
  test("400: responds with an error if required properties are missing", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
      expect(response.body.msg).toBe("Bad Request: Missing required properties");
      });
    });
  test("400: responds with an error for an invalid article ID", () => {
     const newComment = {
       username: "icellusedkars",
       body: "This is a new comment.",
     };
     return request(app)
       .post("/api/articles/not-a-number/comments")
       .send(newComment)
       .expect(400)
       .then((response) => {
         expect(response.body.msg).toBe("Invalid id");
       });
   });  
    test("404: responds with an error if username does not exist", () => {
      const newComment = {
        username: "nonexistentuser", // 
        body: "This is a new comment.",
      };
      return request(app)
        .post("/api/articles/7/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No user found for username: nonexistentuser"
          );
        });
    }); 
  test("404: responds with an error if article ID does not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is a new comment.",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
      expect(response.body.msg).toBe(
        "404 Not found"
      );
    });
  });
});
