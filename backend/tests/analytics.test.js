import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";

describe("📊 Analytics API", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Tokens simulés (mock)
    adminToken = "Bearer faketoken_admin";
    userToken = "Bearer faketoken_user";
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("❌ Refuse l’accès sans token", async () => {
    const res = await request(app).get("/api/analytics/overview");
    expect(res.statusCode).toBe(401);
  });

  it("🚫 Refuse l’accès à un utilisateur non-admin", async () => {
    const res = await request(app)
      .get("/api/analytics/overview")
      .set("Authorization", userToken);
    expect(res.statusCode).toBe(403);
  });

  it("✅ Permet à un admin d’accéder aux statistiques globales", async () => {
    const res = await request(app)
      .get("/api/analytics/overview")
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalUsers");
    expect(res.body).toHaveProperty("totalRomans");
    expect(res.body).toHaveProperty("totalReads");
  });

  it("📈 Vérifie la structure de /analytics/romans", async () => {
    const res = await request(app)
      .get("/api/analytics/romans")
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("reads");
      expect(res.body[0]).toHaveProperty("likes");
    }
  });
});
