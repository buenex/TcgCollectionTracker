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

  it("should propagate repository error", async () => {
    usersRepo.findByHash.mockRejectedValue(new Error("DB error"));
  
    await expect(
      usersService.getOrCreateUser({hash: "abc123"})
    ).rejects.toThrow("DB error");
  });

  it("should delete user ", async () => {
    usersRepo.deleteUser.mockResolvedValue({deleted:true});
  
    await expect(usersService.deleteUser("abc123")).toBeTruthy()
  });
  
});
