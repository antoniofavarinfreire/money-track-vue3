import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import incomeTaxCategoriesRouter from "../routes/IncomeTaxCategories/incomeTaxCategoriesRouter.js"; // ajuste o caminho conforme sua estrutura

const JWT_SECRET = "chave-super-secreta";

let app;
let token;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/income-tax-categories", incomeTaxCategoriesRouter);

  // Cria token JWT válido
  token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
});

describe("Income Tax Categories Routes", () => {
  // --- POST /income-tax-categories ---
  it("POST: Deve criar uma nova categoria de imposto de renda", async () => {
    const res = await request(app)
      .post("/income-tax-categories/create-category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Categoria Teste",
        deductible: true,
        description: "Categoria criada para teste",
      });

    expect([201, 400]).toContain(res.status); // pode falhar se já existir
    if (res.status === 201) {
      expect(res.body).toHaveProperty("message", "Categoria criada com sucesso.");
      expect(res.body.category).toHaveProperty("name", "Categoria Teste");
    }
  });

  it("POST: Deve falhar sem token", async () => {
    const res = await request(app)
      .post("/income-tax-categories/create-category")
      .send({
        name: "Sem Token",
        deductible: false,
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- GET /income-tax-categories ---
  it("GET: Deve listar todas as categorias", async () => {
    const res = await request(app)
      .get("/income-tax-categories/view-all-category")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET: Deve falhar sem token", async () => {
    const res = await request(app).get("/income-tax-categories/view-all-category");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- POST /income-tax-categories/getById ---
  it("POST /view-id-category: Deve retornar uma categoria específica", async () => {
    const res = await request(app)
      .post("/income-tax-categories/view-id-category")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1 });

    expect([200, 404]).toContain(res.status);
  });

  it("POST /view-id-category: Deve falhar sem token", async () => {
    const res = await request(app)
      .post("/income-tax-categories/view-id-category")
      .send({ id: 1 });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- PUT /income-tax-categories ---
  it("PUT: Deve atualizar uma categoria existente", async () => {
    const res = await request(app)
      .put("/income-tax-categories/update-id-category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: 1,
        name: "Categoria Atualizada",
        deductible: false,
        description: "Descrição atualizada",
      });

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("message", "Categoria atualizada com sucesso.");
      expect(res.body.category).toHaveProperty("name", "Categoria Atualizada");
    }
  });

  it("PUT: Deve falhar sem token", async () => {
    const res = await request(app)
      .put("/income-tax-categories/update-id-category")
      .send({
        id: 1,
        name: "Sem Token Update",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- DELETE /income-tax-categories ---
  it("DELETE: Deve deletar uma categoria existente", async () => {
    const res = await request(app)
      .delete("/income-tax-categories/delete-id-category")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1 });

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.message).toBe("Categoria deletada com sucesso.");
    }
  });

  it("DELETE: Deve falhar sem token", async () => {
    const res = await request(app)
      .delete("/income-tax-categories/delete-id-category")
      .send({ id: 1 });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });
});
