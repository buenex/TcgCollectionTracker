vi.mock("../../../src/config/db.js", () => ({
    default: {
      query: vi.fn()
    }
  }));

import db from "../../../src/config/db.js";
import * as cardRepository from "../../../src/repositories/cards.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("cards.repository", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("insert new cards", async () => {
    const fakeRows = [{ id: 1, 
                        name: "teste",
                        image:"image_url.png",
                        rarity:"illustration rare",
                        code:"codeTest",
                        set_id:"TST",
                        set_name:"set_name_test" }];
  
    db.query.mockResolvedValue({ rows: fakeRows });
  
    const result = await cardRepository.insertCards(fakeRows);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeUndefined();

    
const [query, params] = db.query.mock.calls[0];

expect(query).toContain("INSERT INTO cards");
expect(query).toContain("ON CONFLICT DO NOTHING");

expect(params).toEqual([
  1,
  "teste",
  "image_url.png",
  "illustration rare",
  "codeTest",
  "TST",
  "set_name_test",
]);
  });
  
  it("remove card", async () => {
    const card = {id:"test12"};
  
    db.query.mockResolvedValue(card );
  
    const result = await cardRepository.removeCard(card.id);
  
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM cards WHERE id = $1",
      ["test12"]
    );
    expect(result).toBeUndefined()
  });

  it("list all cards", async () => {
    const cards = [{id:"test12",name:"teste"},{id:"tst003",name:"teste2"}];
    const expected = [cards[0],cards[1]]
  
    db.query.mockResolvedValue({rows:cards});
  
    const result = await cardRepository.listCards();
  
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM cards"
    );
    expect(result).toEqual(expected);
  });

  it("list card by name", async () => {
    const cards = [{name:"teste"}];
  
    db.query.mockResolvedValue({rows:cards});
  
    const result = await cardRepository.listCardsByName(cards[0].name);
  
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM cards WHERE card_name ILIKE '%' || $1 || '%' OR code ILIKE '%' || $1 || '%'",
      [cards[0].name]
    );
    expect(result).toEqual(cards);
  });

  it("list card by id", async () => {
    const cards = [{id:"abc123"}];
  
    db.query.mockResolvedValue({rows:cards});
  
    const result = await cardRepository.listCardsById(cards[0].id);
  
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM cards WHERE id ILIKE '%' || $1 || '%' OR code ILIKE '%' || $1 || '%'",
      [cards[0].id]
    );
    expect(result).toEqual(cards);
  });

  it("search card by term", async () => {
    const cards = [{id:"abc123",name:"teste123"}];
  
    db.query.mockResolvedValue({rows:cards});
  
    const result = await cardRepository.searchCards("teste12");
  
    expect(db.query).toHaveBeenCalledWith(
      `
      SELECT *
      FROM cards
      WHERE id ILIKE '%' || $1 || '%'
         OR name ILIKE '%' || $1 || '%'
         OR code ILIKE '%' || $1 || '%'
      `,
      ["teste12"]
    );
    expect(result).toEqual(cards);
  });
});
