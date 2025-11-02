import request from "supertest";
import app from "../../index.js";

describe("🧪 Tests d’intégration API Plumero", () => {
  it("GET /api/health → doit répondre OK", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/romans → doit renvoyer une liste JSON", async () => {
    const res = await request(app).get("/api/romans");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("GET /api/romans/inexistant → doit renvoyer 404", async () => {
    const res = await request(app).get("/api/romans/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });
});
