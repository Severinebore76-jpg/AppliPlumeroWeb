import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

describe("📨 Messages API", () => {
  let user1Token, user2Token, messageId, user1Id, user2Id;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Message.deleteMany();
    await User.deleteMany();

    const user1 = await User.create({
      name: "Alice",
      email: "alice@test.com",
      password: "password123",
    });

    const user2 = await User.create({
      name: "Bob",
      email: "bob@test.com",
      password: "password123",
    });

    user1Id = user1._id;
    user2Id = user2._id;

    user1Token = "Bearer faketoken_user1";
    user2Token = "Bearer faketoken_user2";
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("🚫 Refuse l’envoi de message sans authentification", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ recipient: user2Id, content: "Bonjour sans token" });
    expect(res.statusCode).toBe(401);
  });

  it("✅ Envoie un message d’un utilisateur à un autre", async () => {
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", user1Token)
      .send({ recipient: user2Id, content: "Salut Bob, comment ça va ?" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("content", "Salut Bob, comment ça va ?");
    expect(res.body).toHaveProperty("sender");
    messageId = res.body._id;
  });

  it("✅ Récupère la boîte de réception de l’utilisateur destinataire", async () => {
    const res = await request(app)
      .get("/api/messages/inbox")
      .set("Authorization", user2Token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("content");
  });

  it("✅ Marque un message comme lu", async () => {
    const res = await request(app)
      .put(`/api/messages/${messageId}/read`)
      .set("Authorization", user2Token);

    expect(res.statusCode).toBe(200);
    expect(res.body.isRead).toBe(true);
  });

  it("🚫 Empêche un utilisateur non concerné de supprimer le message", async () => {
    const res = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set("Authorization", "Bearer faketoken_hacker");
    expect(res.statusCode).toBe(403);
  });

  it("✅ Supprime un message par son destinataire", async () => {
    const res = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set("Authorization", user2Token);
    expect(res.statusCode).toBe(200);
  });
});
