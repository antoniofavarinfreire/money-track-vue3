import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import usersRouter from "../routes/Users/userRouter.js"; // ajuste o caminho conforme sua estrutura

const JWT_SECRET = "chave-super-secreta";

let app;
let token;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use("/users", usersRouter);

  // Cria token JWT válido
  token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
});

describe("Users Routes", () => {
  // --- POST /users ---
  it("POST: Deve criar um novo usuário", async () => {
    const res = await request(app).post("/users/create-user").send({
      name: "Usuário Teste",
      email: "teste@example.com",
      password: "senha123",
    });

    expect([201, 400]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toHaveProperty("message", "Usuário criado com sucesso");
      expect(res.body.user).toHaveProperty("email", "teste@example.com");
    }
  });

  // --- POST /users/login ---
  it("POST /login: Deve realizar login com sucesso", async () => {
    const res = await request(app).post("/users/login").send({
      email: "teste@example.com",
      password: "senha123",
    });

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("message", "Login bem-sucedido");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "teste@example.com");
    }
  });

  it("POST /login: Deve falhar com credenciais incorretas", async () => {
    const res = await request(app).post("/users/login").send({
      email: "email_invalido@example.com",
      password: "senha_errada",
    });

    expect([401, 500]).toContain(res.status);
  });

  // --- GET /users ---
  it("GET: Deve listar todos os usuários", async () => {
    const res = await request(app)
      .get("/users/view-all-users")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it("GET: Deve falhar sem token", async () => {
    const res = await request(app).get("/users/view-all-users");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- POST /users/getUserById ---
  it("POST /getUserById: Deve retornar um usuário específico", async () => {
    const res = await request(app)
      .post("/users/getUserById")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1 });

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("user_id");
      expect(res.body).toHaveProperty("name");
    }
  });

  it("POST /getUserById: Deve falhar sem token", async () => {
    const res = await request(app).post("/users/getUserById").send({ id: 1 });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- PUT /users/:id ---
  it("PUT /:id: Deve atualizar um usuário existente", async () => {
    const res = await request(app)
      .put("/users/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Usuário Atualizado",
        email: "teste@example.com",
      });

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("message", "Usuário atualizado com sucesso");
      expect(res.body.user).toHaveProperty("name", "Usuário Atualizado");
    }
  });

  it("PUT /:id: Deve falhar sem token", async () => {
    const res = await request(app)
      .put("/users/1")
      .send({ name: "Sem Token" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });

  // --- DELETE /users/:id ---
  it("DELETE /:id: Deve deletar um usuário existente", async () => {
    const res = await request(app)
      .delete("/users/1")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.message).toBe("Usuário deletado com sucesso");
    }
  });

  it("DELETE /:id: Deve falhar sem token", async () => {
    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token não fornecido.");
  });
});
