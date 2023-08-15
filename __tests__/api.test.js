const app = require('../app.js');
const request = require('supertest');
const endpoints = require('../endpoints.json')
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe('app', () => {
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
  describe('/api/articles/:article_id', () => {
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
      test('404: responds with a 404 error and an error message when a valod id which does not exist is given', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('No article found for article_id: 999');
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
  })  
})


