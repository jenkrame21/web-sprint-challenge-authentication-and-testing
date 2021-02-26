const request = require("supertest");
const db = require("../data/dbConfig.js");
const server = require("./server.js");

const userOne = { username: "Captain Marvel", password: "$2a$10$LGD/0icf2yxx..mXbw0yde11.ZPOwPIDrORkTFEjlAmv4VW5vWeYG" };
const userTwo = { username: "newUser", password: "$2a$10$lkyMZuUOMocgFT/b7XLEOupQ1ApHHGvOEnEJDUpaLb1zrbJmYEAW6" };


test('sanity', () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("server test", () => {
  // GET - Users
  describe("[GET] /api/users", () => {
    it("responds with 200 status", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toEqual(200);
    });
    it("returns correct # of users", async () => {
      let res;
      await db("users").insert(userOne);
      res = await request(server).get("/api/users");
      expect(res.body).toHaveLength(1);

      await db("users").insert(userTwo);
      res = await request(server).get("/api/users");
      expect(res.body).toHaveLength(2);
    });
    it("returns correct user format", async () => {
      await db("users").insert(userOne);
      await db("users").insert(userTwo);

      const res = await request(server).get("/api/users");
      expect(res.body[0]).toMatchObject({ id: 1, ...userOne });
      expect(res.body[1]).toMatchObject({ id: 2, ...userTwo });
    });
  });

  // POST - Register
  describe("[POST] api/auth/register", () => {
    it("responds with newly created user", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send(userOne);
      expect(res.body).toMatchObject({ id: 1, ...userOne });

      res = await request(server).post("/api/auth/register").send(userTwo);
      expect(res.body).toMatchObject({ id: 2, ...userTwo });
    });
  });

  // POST - Login
  describe("[POST] api/users/login", () => {
    it("responds with logged in user", async () => {
      let res;
      res = await request(server).post("/api/auth/login").send(userOne);
      expect(res.body).toMatchObject({ id: 1, ...userOne });

      res = await request(server).post("/api/auth/login").send(userTwo);
      expect(res.body).toMatchObject({ id: 2, ...userTwo });
    });
  });
});