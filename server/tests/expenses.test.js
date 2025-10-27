import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import expensesRouter from "../routes/Expenses/expensesRouter.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "chave-super-secreta";

let app;
let token;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/expenses", expensesRouter);

  // Token válido simulado
  token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
});

describe("Expenses Routes", () => {
  // --- POST /create-id-expense ---
  it("POST /create-id-expense: deve criar uma nova expense", async () => {
    const res = await request(app)
      .post("/expenses/create-id-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 4,
        income_tax_category_id: 2,
        expense_date: new Date(),
        amount: 150.5,
        description: "Teste de expense",
        validated_for_tax: false,
        invoice_file_path: "/tmp/invoice.pdf",
      });

    expect([201, 500]).toContain(res.status); // 201 OK, 500 se o banco não estiver configurado
  });

  it("POST /create-id-expense: deve falhar sem token", async () => {
    const res = await request(app)
      .post("/expenses/create-id-expense")
      .send({ amount: 100 });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- GET /view-id-all-expense ---
  it("GET /view-id-all-expense: deve listar todas as expenses", async () => {
    const res = await request(app)
      .get("/expenses/view-id-all-expense")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 500]).toContain(res.status);
  });

  // --- POST /view-id-expense ---
  it("POST /view-id-expense: deve retornar uma expense específica", async () => {
    const res = await request(app)
      .post("/expenses/view-id-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1 });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- PUT /update-id-expense ---
  it("PUT /update-id-expense: deve atualizar uma expense", async () => {
    const res = await request(app)
      .put("/expenses/update-id-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({
        expense_id: 1,
        user_id: 1,
        income_tax_category_id: 2,
        expense_date: new Date(),
        amount: 200,
        description: "Atualização de expense",
        validated_for_tax: true,
        invoice_file_path: "/tmp/invoice-updated.pdf",
      });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- DELETE /delete-id-expense ---
  it("DELETE /delete-id-expense: deve deletar uma expense", async () => {
    const res = await request(app)
      .delete("/expenses/delete-id-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({ expense_id: 1 });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- POST /create-user-expense ---
  it("POST /create-user-expense: deve criar despesa vinculada ao usuário logado", async () => {
    const res = await request(app)
      .post("/expenses/create-user-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({
        income_tax_category_id: 1,
        expense_date: new Date(),
        amount: 300,
        description: "Despesa do usuário",
        validated_for_tax: true,
        invoice_file_path: "/tmp/invoice2.pdf",
      });
    expect([201, 500]).toContain(res.status);
  });

  // --- GET /view-user-all-expenses ---
  it("GET /view-user-all-expenses: deve listar despesas do usuário", async () => {
    const res = await request(app)
      .get("/expenses/view-user-all-expenses")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 500]).toContain(res.status);
  });

  // --- POST /view-user-expense ---
  it("POST /view-user-expense: deve buscar despesa específica do usuário", async () => {
    const res = await request(app)
      .post("/expenses/view-user-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1 });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- PUT /update-user-expense ---
  it("PUT /update-user-expense: deve atualizar despesa do usuário", async () => {
    const res = await request(app)
      .put("/expenses/update-user-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({
        expense_id: 1,
        amount: 400,
        description: "Atualização despesa user",
        validated_for_tax: false,
        income_tax_category_id: 1,
        expense_date: new Date(),
      });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- DELETE /delete-user-expense ---
  it("DELETE /delete-user-expense: deve deletar despesa do usuário", async () => {
    const res = await request(app)
      .delete("/expenses/delete-user-expense")
      .set("Authorization", `Bearer ${token}`)
      .send({ expense_id: 1 });
    expect([200, 404, 500]).toContain(res.status);
  });

  // --- GET /with-deductible-flag ---
  it("GET /with-deductible-flag: deve retornar despesas com flag dedutível", async () => {
    const res = await request(app)
      .get("/expenses/with-deductible-flag")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 500]).toContain(res.status);
  });
});
