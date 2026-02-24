import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/repositories/obtained.repository.js", () => ({
  listObtained: vi.fn(),
  addObtained: vi.fn(),
  removeObtained: vi.fn(),
  getObtained: vi.fn(),
}));

vi.mock("../../../src/services/users.service.js", () => ({
  getOrCreateUser: vi.fn(),
}));

import * as obtainedService from "../../../src/services/obtained.service.js";
import * as obtainedRepo from "../../../src/repositories/obtained.repository.js";
import * as usersService from "../../../src/services/users.service.js";

describe("obtained.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===============================
  // addObtained
  // ===============================

  it("should add Obtained card for user", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.listObtained.mockResolvedValue([]);
    obtainedRepo.addObtained.mockResolvedValue();

    await obtainedService.addObtained("hash123", "cardABC");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(obtainedRepo.listObtained).toHaveBeenCalledWith("hash123");
    expect(obtainedRepo.addObtained).toHaveBeenCalledWith("hash123", "cardABC");
  });

  it("should not add Obtained card if already exists", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.listObtained.mockResolvedValue(["cardABC"]);

    await expect(
      obtainedService.addObtained("hash123", "cardABC")
    ).rejects.toThrow("Card obtained already saved");
  });

  // ===============================
  // listObtained
  // ===============================

  it("should return Obtained list", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.listObtained.mockResolvedValue(["card1", "card2"]);

    const result = await obtainedService.listObtained("hash123");

    expect(result).toEqual(["card1", "card2"]);
  });

  // ===============================
  // removeObtained
  // ===============================

  it("should remove Obtained card", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });
  
    obtainedRepo.getObtained.mockResolvedValue(true);
    obtainedRepo.removeObtained.mockResolvedValue();
  
    await obtainedService.removeObtained("hash123", "cardABC");
  
    expect(obtainedRepo.getObtained).toHaveBeenCalledWith("hash123", "cardABC");
    expect(obtainedRepo.removeObtained).toHaveBeenCalledWith("hash123", "cardABC");
  });
  
});
