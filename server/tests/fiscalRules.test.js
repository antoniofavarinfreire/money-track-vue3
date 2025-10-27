import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import fiscalRulesRouter from "../routes/FiscalRules/fiscalRulesRouter.js";
import jwt from "jsonwebtoken";
import FiscalRule from "../models/FiscalRules.js";

const JWT_SECRET = "chave-super-secreta";

let app;
let token;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/fiscal-rules", fiscalRulesRouter);

  // Token JWT válido
  token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
});

describe("Fiscal Rules Routes", () => {
  // --- POST /fiscal-rules ---
  it("POST: Deve criar uma nova regra fiscal", async () => {
    const res = await request(app)
      .post("/fiscal-rules/create-tax-rule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fiscal_year: 2025,
        income_tax_category_id: 2,
        annual_limit: 50000,
        monthly_limit: 5000
      });

    expect([201, 400]).toContain(res.status); // pode falhar se já existir
    if (res.status === 201) {
      expect(res.body).toHaveProperty("message", "Regra fiscal criada");
      expect(res.body.rule).toHaveProperty("fiscal_year", 2025);
    }
  });

  it("POST: Deve falhar sem token", async () => {
    const res = await request(app)
      .post("/fiscal-rules/create-tax-rule")
      .send({
        fiscal_year: 2025,
        income_tax_category_id: 1,
        annual_limit: 50000,
        monthly_limit: 5000
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- GET /fiscal-rules ---
  it("GET: Deve listar todas as regras fiscais", async () => {
    const res = await request(app)
      .get("/fiscal-rules/view-all-tax-rule")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET: Deve falhar sem token", async () => {
    const res = await request(app).get("/fiscal-rules/view-all-tax-rule");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- GET /fiscal-rules/:id ---
  it("GET /:id: Deve retornar uma regra específica", async () => {
    const res = await request(app)
      .get("/fiscal-rules/view-id-tax-rule/1")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
  });

  it("GET /:id: Deve falhar sem token", async () => {
    const res = await request(app).get("/fiscal-rules/view-id-tax-rule/1");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- PUT /fiscal-rules/:id ---
  it("PUT /:id: Deve atualizar uma regra existente", async () => {
    const res = await request(app)
      .put("/fiscal-rules/update-id-tax-rule/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        annual_limit: 60000,
        monthly_limit: 5500
      });

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("message", "Regra atualizada");
      expect(res.body.rule).toHaveProperty("annual_limit", 60000);
    }
  });

  it("PUT /:id: Deve falhar sem token", async () => {
    const res = await request(app)
      .put("/fiscal-rules/update-id-tax-rule/1")
      .send({
        annual_limit: 60000,
        monthly_limit: 5500
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- DELETE /fiscal-rules/:id ---
  it("DELETE /:id: Deve deletar uma regra fiscal", async () => {
    const res = await request(app)
      .delete("/fiscal-rules/delete-id-tax-rule/1")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.message).toBe("Regra fiscal deletada");
    }
  });

  it("DELETE /:id: Deve falhar sem token", async () => {
    const res = await request(app).delete("/fiscal-rules/delete-id-tax-rule/8");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });
});
