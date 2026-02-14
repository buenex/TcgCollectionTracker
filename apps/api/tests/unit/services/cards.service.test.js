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
    const cachedCards = [{ id: "1" }];

    cache.get.mockResolvedValue(JSON.stringify(cachedCards));

    const result = await cardsService.searchCardsByName("pikachu");

    expect(cache.get).toHaveBeenCalledWith("cards:name:pikachu");
    expect(pokemonApi.searchCards).not.toHaveBeenCalled();
    expect(result).toEqual(cachedCards);
  });

  it("should call API, save in DB and cache when cache is empty", async () => {
    const apiCards = [{ card_id: "25" }];

    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue(apiCards );
    cache.set.mockResolvedValue();
    cardsRepo.insertCards.mockResolvedValue();

    const result = await cardsService.searchCardsByName("pikachu");

    expect(pokemonApi.searchCards).toHaveBeenCalledWith("pikachu");
    expect(cardsRepo.insertCards).toHaveBeenCalledWith(apiCards);

    expect(cache.set).toHaveBeenCalledWith(
      "cards:name:pikachu",
      JSON.stringify(apiCards),
      60 * 60
    );
    expect(result).toEqual(apiCards);
  });

  it("should throw error if searchCardsByName finds nothing", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCards.mockResolvedValue([]);

    await expect(cardsService.searchCardsByName("unknown"))
      .rejects.toThrow("Card not found");
  });

  it("should throw error if searchCardById finds nothing", async () => {
    cache.get.mockResolvedValue(null);
    pokemonApi.searchCardById.mockResolvedValue({ data: null });

    await expect(cardsService.searchCardById(1))
      .rejects.toThrow("Card not found");
  });
});
