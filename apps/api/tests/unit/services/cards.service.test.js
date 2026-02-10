vi.mock("../../../src/utils/cache.js");
vi.mock("../../../src/utils/pokemonApi.js");
vi.mock("../../../src/repositories/cards.repository.js")

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cardsService from "../../../src/services/cards.service.js";
import * as cache from "../../../src/utils/cache.js";
import * as pokemonApi from "../../../src/utils/pokemonApi.js";
import { resetMocks } from "../../helpers/resetMock.js";
import * as cardsRepo from "../../../src/repositories/cards.repository.js"


describe("cards.service", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should return cards from cache when available", async () => {
    const cachedCards = [{ id: "1" }];

    cache.get.mockResolvedValue(JSON.stringify(cachedCards));

    const result = await cardsService.searchCardsByName("pikachu");

    expect(cache.get).toHaveBeenCalledWith("cards:pikachu");
    expect(pokemonApi.searchCards).not.toHaveBeenCalled();
    expect(result).toEqual(cachedCards);
  });

  it("should call API when cache is empty", async () => {
    const apiCards = [{ id: "25" }];

    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue(apiCards);
    cache.set.mockResolvedValue();

    const result = await cardsService.searchCardsByName("pikachu");

    expect(pokemonApi.searchCards).toHaveBeenCalledWith("pikachu");
    expect(cache.set).toHaveBeenCalled();
    expect(result).toEqual(apiCards);
  });

  it("should throw error if card not found", async () => {
    cardsRepo.listFavorites.mockResolvedValue(null);
  
    await expect(cardsService.getCardById(1))
      .rejects.toThrow("Card not found");
  });
  
  it("should not favorite non-existing card", async () => {
    cardsRepo.listFavorites.mockResolvedValue(null);
  
    await expect(cardsService.favoriteCard(1, 1))
      .rejects.toThrow("Card not found");
  });

  it("should propagate repository error on favorite", async () => {
    cardsRepo.listFavorites.mockResolvedValue({ id: 1 });
    cardsRepo.listFavorites.mockRejectedValue(new Error("DB error"));
  
    await expect(cardsService.searchCardsByName("Tets"))
      .rejects.toThrow("DB error");
  });
  
});
