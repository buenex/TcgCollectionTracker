vi.mock("../../../src/config/db.js", () => ({
    default: {
      query: vi.fn()
    }
  }));

import db from "../../../src/config/db.js";
import * as usersRepository from "../../../src/repositories/users.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("users.repository", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("find user by hash", async () => {
    const fakeRows = [{ id: 1, hash: "abc123" }];
  
    db.query.mockResolvedValue({ rows: fakeRows });
  
    const result = await usersRepository.findByHash("abc123");
  
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE hash = $1",
      ["abc123"]
    );
  
    expect(result).toEqual(fakeRows[0]);
  });
  
  it("create a new user", async () => {
    const fakeRows = [{ id: 1, hash: "abc123" }];
  
    db.query.mockResolvedValue({ rows: fakeRows });
  
    const result = await usersRepository.create("abc123");
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toEqual(fakeRows[0]);
  });
  

  it("delete a user by hash", async () => {
    db.query.mockResolvedValue({ rowCount: 1 });
  
    const result = await usersRepository.deleteUser("abc123");
  
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM users WHERE hash = $1 ",
      ["abc123"]
    );
  
    expect(result).toEqual({ rowCount: 1 });
  });  
});
