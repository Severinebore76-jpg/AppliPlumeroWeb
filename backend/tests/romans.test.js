// backend/tests/romans.test.js

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../index.js";
import User from "../models/User.js";
import Roman from "../models/Roman.js";

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

describe("📚 API Romans — tests d'intégration", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // 1. Connexion DB
    await mongoose.connect(MONGO_URI);

    // 2. Nettoyage collections concernées
    await User.deleteMany({});
    await Roman.deleteMany({});

    // 3. Création d'un user "auteur"
    testUser = await User.create({
      name: "Séverine Test",
      email: "severine.romans@test.com",
      password: "Plumero@2025",
      role: "admin", // admin pour pouvoir créer / modifier / supprimer
      isVerified: true,
    });

    // 4. Génération d'un JWT valide
    authToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("🚫 doit refuser la création sans token", async () => {
    const res = await request(app).post("/api/romans").send({
      title: "Roman sans token",
      summary: "Pas d'authentification",
    });

    expect(res.statusCode).toBe(401);
  });

  it("✅ doit créer un roman avec un token valide", async () => {
    const res = await request(app)
      .post("/api/romans")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Le carnet oublié",
        summary: "Mystère entre deux époques",
        tags: ["mystère", "drame"],
        status: "published",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Le carnet oublié");
    expect(res.body).toHaveProperty("slug");
    expect(res.body.slug).toBe("le-carnet-oublie");
  });

  it("✅ doit lister les romans", async () => {
    const res = await request(app)
      .get("/api/romans")
      .query({ page: 1, limit: 10 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results) || Array.isArray(res.body)).toBe(
      true,
    );
  });

  it("✅ doit récupérer un roman par son slug", async () => {
    const res = await request(app).get("/api/romans/le-carnet-oublie");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("slug", "le-carnet-oublie");
  });

  it("✅ doit mettre à jour un roman existant", async () => {
    const roman = await Roman.findOne({ slug: "le-carnet-oublie" });

    const res = await request(app)
      .put(`/api/romans/${roman._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        summary: "Résumé mis à jour",
        isFeatured: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("summary", "Résumé mis à jour");
    expect(res.body).toHaveProperty("isFeatured", true);
  });

  it("✅ doit supprimer un roman", async () => {
    const roman = await Roman.findOne({ slug: "le-carnet-oublie" });

    const res = await request(app)
      .delete(`/api/romans/${roman._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode === 200 || res.statusCode === 204).toBe(true);

    const stillThere = await Roman.findById(roman._id);
    expect(stillThere).toBeNull();
  });
});
