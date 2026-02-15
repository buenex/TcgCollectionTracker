import { describe, it, expect, vi, beforeEach } from "vitest";

// ===============================
// MOCKS (ANTES DOS IMPORTS)
// ===============================

vi.mock("../../../src/repositories/favorites.repository.js", () => ({
  listFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  getFavorite: vi.fn(),
}));

vi.mock("../../../src/services/users.service.js", () => ({
  getOrCreateUser: vi.fn(),
}));

// ===============================
// IMPORTS REAIS DO SERVICE
// ===============================

import * as favoritesService from "../../../src/services/favorites.service.js";
import * as favoritesRepo from "../../../src/repositories/favorites.repository.js";
import * as usersService from "../../../src/services/users.service.js";

describe("favorites.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===============================
  // addFavorite
  // ===============================

  it("should add favorite card for user", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    favoritesRepo.listFavorites.mockResolvedValue([]);
    favoritesRepo.addFavorite.mockResolvedValue();

    await favoritesService.addFavorite("hash123", "cardABC");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(favoritesRepo.listFavorites).toHaveBeenCalledWith("hash123");
    expect(favoritesRepo.addFavorite).toHaveBeenCalledWith("hash123", "cardABC");
  });

  it("should not add favorite card if already exists", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    favoritesRepo.listFavorites.mockResolvedValue(["cardABC"]);

    await expect(
      favoritesService.addFavorite("hash123", "cardABC")
    ).rejects.toThrow("Card already favorited");
  });

  // ===============================
  // listFavorites
  // ===============================

  it("should return favorites list", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    favoritesRepo.listFavorites.mockResolvedValue(["card1", "card2"]);

    const result = await favoritesService.listFavorites("hash123");

    expect(result).toEqual(["card1", "card2"]);
  });

  // ===============================
  // removeFavorite
  // ===============================

  it("should remove favorite card", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });
  
    favoritesRepo.getFavorite.mockResolvedValue(true);
    favoritesRepo.removeFavorite.mockResolvedValue();
  
    await favoritesService.removeFavorite("hash123", "cardABC");
  
    expect(favoritesRepo.getFavorite).toHaveBeenCalledWith("hash123", "cardABC");
    expect(favoritesRepo.removeFavorite).toHaveBeenCalledWith("hash123", "cardABC");
  });
  
});
