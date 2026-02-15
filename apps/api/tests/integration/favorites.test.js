import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";
import * as cardService from "../../src/services/cards.service.js";

describe("Favorites integration", () => {
  const hash = "test_hash";
  const cardId = "swsh1-1";

  beforeAll(async ()=>{
    await cardService.searchCardsById(cardId)
  });

  // limpa banco antes de cada teste
  beforeEach(async () => {
    await db.query("DELETE FROM favorite_cards");
    await db.query("DELETE FROM users");

  });

  it("should create user automatically and add favorite", async () => {
    const res = await request(app)
      .post(`/v1/favorites/${hash}/${cardId}`)
      .send();

    expect(res.status).toBe(204);

    const favorites = await db.query(
      "SELECT * FROM favorite_cards WHERE user_hash = $1",
      [hash]
    );

    expect(favorites.rows.length).toBe(1);
    expect(favorites.rows[0].card_id).toBe(cardId);
  });

  it("should list favorites", async () => {
    // adiciona direto no banco
    await db.query("INSERT INTO users(hash) VALUES($1)", [hash]);
    await db.query(
      "INSERT INTO favorite_cards(user_hash, card_id) VALUES($1,$2)",
      [hash, cardId]
    );

    const res = await request(app)
      .get(`/v1/favorites/${hash}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([cardId]);
  });

  it("should remove favorite", async () => {
    await db.query("INSERT INTO users(hash) VALUES($1)", [hash]);
    await db.query(
      "INSERT INTO favorite_cards(user_hash, card_id) VALUES($1,$2)",
      [hash, cardId]
    );

    const res = await request(app)
      .delete(`/v1/favorites/${hash}/${cardId}`);

    expect(res.status).toBe(204);

    const favorites = await db.query(
      "SELECT * FROM favorite_cards WHERE user_hash = $1",
      [hash]
    );

    expect(favorites.rows.length).toBe(0);
  });
});
