import { describe, it, expect, vi, beforeEach } from "vitest";
import * as favoritesService from "../../../src/services/favorites.service.js";
import * as usersService from "../../../src/services/users.service.js";
import * as favoritesRepo from "../../../src/repositories/favorites.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";


vi.mock("../../../src/services/users.service.js");
vi.mock("../../../src/repositories/favorites.repository.js");

describe("favorites.service", () => {
  beforeEach(() => {
    resetMocks;
  });

  it("should add favorite card for user", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ id: 1 });
    favoritesRepo.add.mockResolvedValue();

    await favoritesService.addFavorite("hash123", "cardABC");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(favoritesRepo.add).toHaveBeenCalledWith(1, "cardABC");
  });
});
