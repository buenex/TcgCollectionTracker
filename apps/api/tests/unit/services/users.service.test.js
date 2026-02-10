import { describe, it, expect, vi, beforeEach } from "vitest";
import * as usersService from "../../../src/services/users.service.js";
import * as usersRepo from "../../../src/repositories/users.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";
import * as mock from "../../helpers/mockResponse.js"

vi.mock("../../../src/repositories/users.repository.js");

describe("users.service", () => {
  beforeEach(() => {
    resetMocks;
  });

  it("should return existing user when found", async () => {
    const fakeUser = { id: 1, hash: "abc" };

    usersRepo.findByHash.mockResolvedValue(fakeUser);

    const result = await usersService.getOrCreateUser("abc");

    expect(usersRepo.findByHash).toHaveBeenCalledWith("abc");
    expect(usersRepo.create).not.toHaveBeenCalled();
    expect(result).toEqual(fakeUser);
  });

  it("should create user when not found", async () => {
    const newUser = { id: 2, hash: "xyz" };

    usersRepo.findByHash.mockResolvedValue(null);
    usersRepo.create.mockResolvedValue(newUser);

    const result = await usersService.getOrCreateUser("xyz");

    expect(usersRepo.findByHash).toHaveBeenCalledWith("xyz");
    expect(usersRepo.create).toHaveBeenCalledWith("xyz");
    expect(result).toEqual(newUser);
  });

  it("should throw error if email already exists", async () => {
    usersRepo.findByEmail.mockResolvedValue({ id: 1 });
  
    await expect(
      usersService.createUser({ email: "test@test.com", password: "123" })
    ).rejects.toThrow("User already exists");
  });

  it("should propagate repository error", async () => {
    usersRepo.findByEmail.mockRejectedValue(new Error("DB error"));
  
    await expect(
      usersService.createUser({ email: "test@test.com", password: "123" })
    ).rejects.toThrow("DB error");
  });
  
});
