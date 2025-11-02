import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import User from "../models/User.js";

describe("🔐 Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany(); // Nettoyage avant tests
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const mockUser = {
    name: "Séverine Test",
    email: "severine@test.com",
    password: "Password123!",
  };

  it("✅ Crée un nouvel utilisateur avec /register", async () => {
    const res = await request(app).post("/api/auth/register").send(mockUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(mockUser.email);
  });

  it("🚫 Empêche l’enregistrement avec un email déjà utilisé", async () => {
    const res = await request(app).post("/api/auth/register").send(mockUser);

    expect(res.statusCode).toBe(400);
  });

  it("✅ Permet la connexion avec /login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", mockUser.email);
  });

  it("🚫 Refuse la connexion avec mauvais mot de passe", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: mockUser.email,
      password: "BadPass123!",
    });

    expect(res.statusCode).toBe(401);
  });

  it("🚫 Refuse la création sans mot de passe", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "new@test.com" });

    expect(res.statusCode).toBe(400);
  });
});
