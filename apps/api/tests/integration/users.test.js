import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";

describe("Users integration", () => {
  const hash = "test_hash";

  // limpa banco antes de cada teste
  beforeEach(async () => {
    await db.query("DELETE FROM obtained_cards");
    await db.query("DELETE FROM favorite_cards");
    await db.query("DELETE FROM users");
  });

  it("should create user automatically when accessing any route that depends on user", async () => {
    // usa uma rota que cria usuário indiretamente
    const res = await request(app)
      .get(`/v1/favorites/${hash}`);

    expect(res.status).toBe(200);

    const users = await db.query(
      "SELECT * FROM users WHERE hash = $1",
      [hash]
    );

    expect(users.rows.length).toBe(1);
    expect(users.rows[0].hash).toBe(hash);
  });

  it("should not duplicate user if already exists", async () => {
    await db.query("INSERT INTO users(hash) VALUES($1)", [hash]);

    await request(app).get(`/v1/favorites/${hash}`);

    const users = await db.query(
      "SELECT * FROM users WHERE hash = $1",
      [hash]
    );

    expect(users.rows.length).toBe(1);
  });

  it("should return existing user hash correctly through dependent route", async () => {
    await db.query("INSERT INTO users(hash) VALUES($1)", [hash]);

    const res = await request(app)
      .get(`/v1/favorites/${hash}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
