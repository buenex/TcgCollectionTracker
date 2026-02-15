import { describe, it, expect, vi, beforeEach } from "vitest";
import * as obtainedService from "../../../src/services/obtained.service.js";
import * as usersService from "../../../src/services/users.service.js";
import * as obtainedRepo from "../../../src/repositories/obtained.repository.js";
import { AppError } from "../../../src/utils/appError.js";

// ===============================
// MOCKS (antes dos imports reais do código testado)
// ===============================

vi.mock("../../../src/services/users.service.js");

vi.mock("../../../src/repositories/obtained.repository.js", () => ({
  listObtained: vi.fn(),
  addObtained: vi.fn(),
  removeObtained: vi.fn(),
  getObtained: vi.fn(),
}));

describe("obtained.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===============================
  // listObtained
  // ===============================

  it("should return obtained list", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });
    obtainedRepo.listObtained.mockResolvedValue(["card1", "card2"]);

    const result = await obtainedService.listObtained("hash123");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(obtainedRepo.listObtained).toHaveBeenCalledWith("hash123");
    expect(result).toEqual(["card1", "card2"]);
  });

  // ===============================
  // addObtained
  // ===============================

  it("should add favorite card for user", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.listObtained.mockResolvedValue([]);
    obtainedRepo.addObtained.mockResolvedValue();

    await obtainedService.addObtained("hash123", "cardABC");

    expect(usersService.getOrCreateUser).toHaveBeenCalledWith("hash123");
    expect(obtainedRepo.listObtained).toHaveBeenCalledWith("hash123");
    expect(obtainedRepo.addObtained).toHaveBeenCalledWith("hash123", "cardABC");
  });

  it("should not add favorite card if already exists", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.listObtained.mockResolvedValue(["cardABC"]);

    await expect(
      obtainedService.addObtained("hash123", "cardABC")
    ).rejects.toThrow(AppError);

    await expect(
      obtainedService.addObtained("hash123", "cardABC")
    ).rejects.toMatchObject({
      message: "Card obtained already saved!",
      statusCode: 409,
    });

    expect(obtainedRepo.addObtained).not.toHaveBeenCalled();
  });

  // ===============================
  // removeObtained
  // ===============================

  it("should remove favorite when exists", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.getObtained.mockResolvedValue(true);
    obtainedRepo.removeObtained.mockResolvedValue();

    await obtainedService.removeObtained("hash123", "cardABC");

    expect(obtainedRepo.getObtained).toHaveBeenCalledWith("hash123", "cardABC");
    expect(obtainedRepo.removeObtained).toHaveBeenCalledWith("hash123", "cardABC");
  });

  it("should throw error when favorite does not exist", async () => {
    usersService.getOrCreateUser.mockResolvedValue({ hash: "hash123" });

    obtainedRepo.getObtained.mockResolvedValue(false);

    await expect(
      obtainedService.removeObtained("hash123", "cardABC")
    ).rejects.toThrow(AppError);

    await expect(
      obtainedService.removeObtained("hash123", "cardABC")
    ).rejects.toMatchObject({
      message: "Obtained not found",
      statusCode: 404,
    });

    expect(obtainedRepo.removeObtained).not.toHaveBeenCalled();
  });
});
