import mongoose from "mongoose";
import "dotenv/config";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";

const { TEST_DB_HOST, PORT } = process.env;

describe("test api/users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);

    const registerData = {
      email: "magnus@gmail.com",
      password: "123456",
    };
    await request(app).post("/api/users/register").send(registerData);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  test("test 'login' with correct status", async () => {
    const loginData = {
      email: "magnus@gmail.com",
      password: "123456",
    };
    const { statusCode } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(statusCode).toBe(200);
  });

  test("test 'login' return token", async () => {
    const loginData = {
      email: "magnus@gmail.com",
      password: "123456",
    };
    const { body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(typeof body.token === "string").toBe(true);
  });

  test("test 'login' return object with two field - 'email' and 'subscription', type of data - 'String'", async () => {
    const loginData = {
      email: "magnus@gmail.com",
      password: "123456",
    };
    const { body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(typeof body.user.email === "string").toBe(true);
    expect(typeof body.user.subscription === "string").toBe(true);
  });
});
