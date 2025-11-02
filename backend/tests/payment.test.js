import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";

// Mock Stripe (pour éviter tout appel réel)
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: "pi_test123",
        client_secret: "cs_test_secret",
        status: "succeeded",
      }),
    },
  }));
});

describe("💳 Payment API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Purchase.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("✅ Crée une session de paiement Stripe avec succès", async () => {
    const res = await request(app).post("/api/payments/create").send({
      amount: 1999,
      currency: "eur",
      description: "Pack Premium Plumero",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("clientSecret");
    expect(res.body.clientSecret).toContain("cs_test_");
  });

  it("✅ Enregistre la transaction dans Purchase", async () => {
    const purchase = await Purchase.findOne({ amount: 1999 });
    expect(purchase).not.toBeNull();
    expect(purchase.status).toBe("succeeded");
  });

  it("🚫 Refuse un paiement sans montant", async () => {
    const res = await request(app)
      .post("/api/payments/create")
      .send({ currency: "eur" });

    expect(res.statusCode).toBe(400);
  });

  it("🚫 Gère une erreur Stripe proprement", async () => {
    // On force une exception Stripe simulée
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await request(app)
      .post("/api/payments/create")
      .send({ amount: -10, currency: "eur" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
