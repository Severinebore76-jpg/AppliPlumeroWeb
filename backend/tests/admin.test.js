import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import User from "../models/User.js";

describe("🧪 Admin API", () => {
  let adminToken;
  let userToken;
  let createdUser;

  beforeAll(async () => {
    // Connexion MongoDB test
    await mongoose.connect(process.env.MONGO_URI);

    // Création utilisateur admin
    const admin = await User.create({
      name: "Admin Test",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    const user = await User.create({
      name: "User Test",
      email: "user@test.com",
      password: "password123",
      role: "user",
    });

    // Authentification simulée (token mocké)
    adminToken = "Bearer faketoken_admin";
    userToken = "Bearer faketoken_user";
    createdUser = user;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("❌ Refuse l’accès sans token admin", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.statusCode).toBe(401);
  });

  it("🚫 Refuse l’accès aux utilisateurs simples", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", userToken);
    expect(res.statusCode).toBe(403);
  });

  it("✅ Autorise l’accès à l’admin pour la liste des utilisateurs", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
  });

  it("🗑️ Permet la suppression d’un utilisateur", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${createdUser._id}`)
      .set("Authorization", adminToken);
    expect(res.statusCode).toBe(200);
  });
});
