import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Roman from "../models/Roman.js";
import User from "../models/User.js";

describe("💬 Comments API", () => {
  let adminToken, userToken, romanId, commentId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Comment.deleteMany();
    await Roman.deleteMany();
    await User.deleteMany();

    // Création d’un utilisateur admin et d’un utilisateur standard
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
    });

    const roman = await Roman.create({
      title: "Le Carnet Oublié",
      slug: "le-carnet-oublie",
      author: admin._id,
      status: "published",
    });

    // Mock tokens
    adminToken = "Bearer faketoken_admin";
    userToken = "Bearer faketoken_user";
    romanId = roman._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("🚫 Refuse la création sans authentification", async () => {
    const res = await request(app)
      .post(`/api/romans/${romanId}/comments`)
      .send({ text: "Super roman !" });
    expect(res.statusCode).toBe(401);
  });

  it("✅ Permet à un utilisateur connecté de créer un commentaire", async () => {
    const res = await request(app)
      .post(`/api/romans/${romanId}/comments`)
      .set("Authorization", userToken)
      .send({ text: "Super roman !" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("text");
    expect(res.body.text).toBe("Super roman !");
    commentId = res.body._id;
  });

  it("✅ Liste les commentaires d’un roman publiés", async () => {
    const res = await request(app).get(`/api/romans/${romanId}/comments`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("🚫 Refuse la mise à jour d’un commentaire par un autre utilisateur", async () => {
    const res = await request(app)
      .put(`/api/romans/${romanId}/comments/${commentId}`)
      .set("Authorization", adminToken)
      .send({ text: "Tentative de modification non autorisée" });

    expect(res.statusCode).toBe(403);
  });

  it("✅ Permet la mise à jour du commentaire par son auteur", async () => {
    const res = await request(app)
      .put(`/api/romans/${romanId}/comments/${commentId}`)
      .set("Authorization", userToken)
      .send({ text: "Version corrigée de mon commentaire" });

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe("Version corrigée de mon commentaire");
  });

  it("✅ Supprime un commentaire (admin)", async () => {
    const res = await request(app)
      .delete(`/api/romans/${romanId}/comments/${commentId}`)
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
  });
});
