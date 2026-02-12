import { describe, it, expect, vi } from "vitest";
import * as usersController from "../../../src/controllers/users.controller.js";
import * as usersService from "../../../src/services/users.service.js";
import * as mock from "../../helpers/mockResponse.js"

vi.mock("../../../src/services/users.service.js");

describe("", async () =>{
  it("should return 201 when user is created", async () => {
    const req = {
      body: { hash: "abc123" },
    };
  
    const res = mock.mockResponse();
  
    usersService.getOrCreateUser.mockResolvedValue({id:1,hash:req.body.hash});
  
    await usersController.createUser(req, res);
  
    expect(usersService.getOrCreateUser).toHaveBeenCalledWith(req.body.hash);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, hash: req.body.hash });
  });
      
      it("should return 400 if user already exists", async () => {
        const req = {
          body: { email: "test@test.com", password: "123" },
        };
      
        const res = mock.mockResponse();
      
        usersService.getOrCreateUser.mockRejectedValue(new Error("User already exists"));
      
        await usersController.createUser(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "User already exists",
        });
      });

      it("should return 500 on unexpected error", async () => {
        const req = {
          body: { email: "test@test.com", password: "123" },
        };
      
        const res = mock.mockResponse();
      
        usersService.getOrCreateUser.mockRejectedValue(new Error("DB exploded"));
      
        await usersController.createUser(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          error: "Internal server error",
        });
      });
      
})