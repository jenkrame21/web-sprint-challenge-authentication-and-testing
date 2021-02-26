const request = require("supertest");
const db = require("../data/dbConfig.js");
const server = require("./server.js");

const userOne = { username: "newUser" };
const userTwo = { username: "newUser2" };


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
  describe("[GET] /users", () => {
    it("responds with 200 status", async () => {
      const res = await request(server).get("users");
      expect(res.status).toEqual(200);
    });
    it("returns correct # of users", async () => {
      let res;
      await db("users").insert(userOne);
      res = await request(server).get("/users");
      expect(res.body).toHaveLength(1);

      await db("users").insert(userTwo);
      res = await request(server).get("/users");
      expect(res.body).toHaveLength(2);
    });
    it("returns correct user format", async () => {
      await db("users").insert(userOne);
      await db("users").insert(userTwo);

      const res = await request(server).get("/users");
      expect(res.body[0]).toMatchObject({ id: 1, ...userOne });
      expect(res.body[1]).toMatchObject({ id: 2, ...userTwo });
    })
  });
  describe("[POST] /users/register", () => {
    it("responds with newly created user", async () => {
      let res;
      res = await request(server).post("/users").send(userOne);
      expect(res.body).toMatchObject({ id: 1, ...userOne });

      res = await request(server).post("/users").send(userTwo);
      expect(res.body).toMatchObject({ id: 2, ...userTwo });
    });
  });

  // describe("[POST] /users/login", () => {
  //   it("responds with logged in user", async () => {

  //   });
  // });
});

