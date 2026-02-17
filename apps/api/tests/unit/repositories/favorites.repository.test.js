vi.mock("../../../src/config/db.js", () => ({
    default: {
      query: vi.fn()
    }
  }));

import db from "../../../src/config/db.js";
import * as favoriteRepository from "../../../src/repositories/favorites.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("favorite.repository", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("insert new favorite", async () => {
    const favorite = {hash:"abc123",card_id:"teste"}
  
    db.query.mockResolvedValue();
  
    const result = await favoriteRepository.addFavorite(favorite.hash,favorite.card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  
  it("list favorites by user hash", async () => {
    const favorites=[{card_id:"fav1"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:favorites});
  
    const result = await favoriteRepository.listFavorites(user);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toEqual([favorites[0].card_id])
  });

  it("get favorites by user and card", async () => {
    const favorites=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:favorites});
  
    const result = await favoriteRepository.getFavorite(user,favorites[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toEqual(favorites[0])
  });

  it("remove favorites by hash and card_id", async () => {
    const favorites=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue();
  
    const result = await favoriteRepository.removeFavorite(user,favorites[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeUndefined()
  });

  it("get obtained with no results", async () => {
    const favorites=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:[]});
  
    const result = await favoriteRepository.getFavorite(user,favorites[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeNull()
  });
});
