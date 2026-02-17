vi.mock("../../../src/services/users.service.js");

import { describe, it, expect, vi } from "vitest";
import * as usersController from "../../../src/controllers/users.controller.js";
import * as usersService from "../../../src/services/users.service.js";
import * as mock from "../../helpers/mockResponse.js"

describe("", async () => {
  it("should return 201 when user is created", async () => {
    const req = {
      params: { hash: "abc123" },
    };
  
    const res = mock.mockResponse();
    const next = vi.fn();
  
    usersService.getOrCreateUser.mockResolvedValue({
      id: 1,
      hash: req.params.hash,
    });
  
    await usersController.createUser(req, res, next);
  
    expect(usersService.getOrCreateUser).toHaveBeenCalledWith(req.params.hash);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, hash: req.params.hash });
  });
  

  it("should return 500 on unexpected error", async () => {
    const req = {
      params: { hash: "abc123" }, 
    };
  
    const res = mock.mockResponse();
    const next = vi.fn();
  
    const error = new Error("DB exploded");
    error.statusCode = 500;
  
    usersService.getOrCreateUser.mockRejectedValue(error);
  
    await usersController.createUser(req, res, next);
  
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return 200 on delete user", async () => {
    const req = {
      params: { hash: "abc123" },
    };
  
    const res = mock.mockResponse();
    const next = vi.fn();

    usersService.deleteUser.mockResolvedValue({deleted:true})
  
    await usersController.deleteUser(req, res, next);
  
    expect(usersService.deleteUser).toHaveBeenCalledWith(req.params.hash);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if users not found", async () => {
    const req = {
      params: { hash: "abc123" },
    };
  
    const res = mock.mockResponse();
    const next = vi.fn();

    usersService.deleteUser.mockResolvedValue(null)
  
    await usersController.deleteUser(req, res, next);
  
    expect(usersService.deleteUser).toHaveBeenCalledWith(req.params.hash);
    expect(res.status).toHaveBeenCalledWith(404);
  });

})