vi.mock("../../../src/utils/cache.js");
vi.mock("../../../src/utils/pokemonApi.js");
vi.mock("../../../src/repositories/cards.repository.js");
vi.mock("../../../src/utils/pokemonApi.js", () => ({
  searchCards: vi.fn(),
  searchCardById: vi.fn(),
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cardsService from "../../../src/services/cards.service.js";
import * as cache from "../../../src/utils/cache.js";
import * as pokemonApi from "../../../src/utils/pokemonApi.js";
import * as cardsRepo from "../../../src/repositories/cards.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";

describe("cards.service", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should return cards from cache when available", async () => {
    const cachedCards = [{ id: "1", name: "Pikachu" }];
  
    cache.get.mockResolvedValue(cachedCards);
  
    const result = await cardsService.searchCardsByName("pikachu");
  
    expect(cache.get).toHaveBeenCalledWith("cards:pikachu");
    expect(pokemonApi.searchCards).not.toHaveBeenCalled();
    expect(result).toEqual(cachedCards);
  });

  it("should call API, save in DB and cache when cache is empty", async () => {
    const apiCards = [{ card_id: "25", name: "Pikachu" }];
  
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue(apiCards);
    cache.set.mockResolvedValue();
    cardsRepo.insertCards.mockResolvedValue();
  
    const result = await cardsService.searchCardsByName("pikachu");
  
    expect(pokemonApi.searchCards).toHaveBeenCalledWith("pikachu");
    expect(cardsRepo.insertCards).toHaveBeenCalledWith(apiCards);
  
    expect(cache.set).toHaveBeenCalledWith(
      "cards:pikachu",
      apiCards
    );
  
    expect(result).toEqual(apiCards);
  });
  

  it("should throw error if searchCardsByName finds nothing", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue([]);

    await expect(cardsService.searchCardsByName("unknown"))
      .rejects.toThrow("Card not found");
  });

  it("should use prefix cache, filter results and not call API", async () => {
    const cached = [
      { name: "Pikachu" },
      { name: "Pidgey" }
    ];
  
    cache.get
      .mockResolvedValueOnce(null)      // cards:pikachu
      .mockResolvedValueOnce(cached);   // cards:pika
  
    cache.keys.mockResolvedValue([]);
    
    const result = await cardsService.searchCardsByName("pikachu");
  
    expect(pokemonApi.searchCards).not.toHaveBeenCalled();
    expect(result).toEqual([{ name: "Pikachu" }]);
  });
  
  it("should delete more specific cache keys", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue([{ name: "Pikachu" }]);
  
    cache.keys.mockResolvedValue([
      "cards:pikachu123",
      "cards:pikachu"
    ]);
  
    await cardsService.searchCardsByName("pikachu");
  
    expect(cache.del).toHaveBeenCalledWith("cards:pikachu123");
    expect(cache.del).not.toHaveBeenCalledWith("cards:pikachu");
  });
  
  it("should fetch card by id, save in DB and cache", async () => {
    const cards = [{ id: "25", name: "Pikachu" }];
  
    pokemonApi.searchCardById.mockResolvedValue(cards);
    cardsRepo.insertCards.mockResolvedValue();
    cache.set.mockResolvedValue();
  
    const result = await cardsService.searchCardsById("25");
  
    expect(cardsRepo.insertCards).toHaveBeenCalledWith(cards);
    expect(cache.set).toHaveBeenCalledWith("25", cards);
    expect(result).toEqual(cards);
  });
  
  it("should throw when searchCardsById returns empty", async () => {
    pokemonApi.searchCardById.mockResolvedValue([]);
  
    await expect(cardsService.searchCardsById("999"))
      .rejects.toThrow("Card not found");
  });
  
  it("should propagate API error", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockRejectedValue(new Error("API down"));
  
    await expect(cardsService.searchCardsByName("pikachu"))
      .rejects.toThrow("API down");
  });
  
  it("should skip cache clearing when cache.keys is undefined", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue([{ name: "Pikachu" }]);
  
    cache.keys = undefined;
  
    const result = await cardsService.searchCardsByName("pikachu");
  
    expect(result).toBeTruthy();
  });

  it("should get all cards", async () => {
    cardsRepo.listCards.mockResolvedValue([{card_id:1}]);
    const result = await cardsService.getAllCards()
  
    expect(cardsRepo.listCards).toHaveBeenCalled;
    expect(result).toEqual([{card_id:1}])
  });
  
});
