import request from "supertest";
import app from "../../src/app"; // adjust path to your app

describe("🧪 User API Integration Tests", () => {
  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/api/v1/register")
      .send({
        email: "Carrie@example.com",
        username: "Carrie",
        password: "Secret123!",
        name: "Carrie",
        surname: "Doe",
      });

    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("username", "Carrie");
  });

  it("should fail registration with missing field", async () => {
    const res = await request(app)
      .post("/api/v1/register")
      .send({
        email: "jane@example.com",
        username: "jane123",
        password: "Secret123!",
        name: "Jane",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("should fail registration with weak password", async () => {
    const res = await request(app)
      .post("/api/v1/register")
      .send({
        email: "weak@example.com",
        username: "weakuser",
        password: "password",
        name: "Weak",
        surname: "User",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("should log in successfully", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        username: "Alice",
        password: "Secret123!",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        username: "johnny",
        password: "WrongPass!",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("should fail login with nonexistent username", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({
        username: "idontexist",
        password: "Secret123!",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

});
