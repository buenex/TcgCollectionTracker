import { describe, it, expect, vi, beforeEach } from "vitest";
import * as favoritesService from "../../../src/services/favorites.service.js";
import * as usersService from "../../../src/services/users.service.js";
import * as favoritesRepo from "../../../src/repositories/favorites.repository.js";
import { AppError } from "../../../src/utils/appError.js";

// ===============================
// MOCKS (antes dos imports reais do código testado)
// ===============================

vi.mock("../../../src/services/users.service.js");

vi.mock("../../../src/repositories/favorites.repository.js", () => ({
  listFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  getFavorite: vi.fn(),
}));

describe("favorites.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===============================
  // listFavorites
  // ===============================

  it("should return favorites list", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });
    favoritesRepo.listFavorites.mockResolvedValue(["card1", "card2"]);

    const result = await favoritesService.listFavorites("hash123");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(favoritesRepo.listFavorites).toHaveBeenCalledWith("hash123");
    expect(result).toEqual(["card1", "card2"]);
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
    ).rejects.toThrow(AppError);

    await expect(
      favoritesService.addFavorite("hash123", "cardABC")
    ).rejects.toMatchObject({
      message: "Card already favorited",
      statusCode: 409,
    });

    expect(favoritesRepo.addFavorite).not.toHaveBeenCalled();
  });

  // ===============================
  // removeFavorite
  // ===============================

  it("should remove favorite when exists", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    favoritesRepo.getFavorite.mockResolvedValue(true);
    favoritesRepo.removeFavorite.mockResolvedValue();

    await favoritesService.removeFavorite("hash123", "cardABC");

    expect(favoritesRepo.getFavorite).toHaveBeenCalledWith("hash123", "cardABC");
    expect(favoritesRepo.removeFavorite).toHaveBeenCalledWith("hash123", "cardABC");
  });

  it("should throw error when favorite does not exist", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    favoritesRepo.getFavorite.mockResolvedValue(false);

    await expect(
      favoritesService.removeFavorite("hash123", "cardABC")
    ).rejects.toThrow(AppError);

    await expect(
      favoritesService.removeFavorite("hash123", "cardABC")
    ).rejects.toMatchObject({
      message: "Favorite not found",
      statusCode: 404,
    });

    expect(favoritesRepo.removeFavorite).not.toHaveBeenCalled();
  });
});
