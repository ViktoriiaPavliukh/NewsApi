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
        .get("/api").expect(200)
        .then((response) => {
          expect(
          response.body.endpoints
          ).toEqual(endpoints);
        });
    });
  });
  describe("api/topics", () => {
    test("200: responds with an array of topic object", () => {
      return request(app).get("/api/topics").expect(200).then((response) => {
       const { topics } = response.body;
       expect(topics).toBeInstanceOf(Array);
       topics.forEach((topics) => {
         expect(topics).toHaveProperty("description", expect.any(String));
          expect(topics).toHaveProperty("slug", expect.any(String));
       })
      })
    })
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
})


