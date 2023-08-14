const app = require('../app.js');
const request = require('supertest');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const format = require("pg-format");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});
describe('app', () => {
  describe("api/topics", () => {
    test("Status 200: with a message on the body", () => {
      return request(app).get("/api/topics").expect(200);
    });
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
})


