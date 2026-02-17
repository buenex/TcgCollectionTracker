vi.mock("../../../src/config/db.js", () => ({
    default: {
      query: vi.fn()
    }
  }));

import db from "../../../src/config/db.js";
import * as obtainedRepository from "../../../src/repositories/obtained.repository.js";
import { resetMocks } from "../../helpers/resetMock.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("obtained.repository", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("insert new obtained", async () => {
    const obtained = {hash:"abc123",card_id:"teste"}
  
    db.query.mockResolvedValue();
  
    const result = await obtainedRepository.addObtained(obtained.hash,obtained.card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  
  it("list obtained by user hash", async () => {
    const obtained=[{card_id:"fav1"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:obtained});
  
    const result = await obtainedRepository.listObtained(user);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toEqual([obtained[0].card_id])
  });

  it("get obtained by user and card", async () => {
    const obtained=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:obtained});
  
    const result = await obtainedRepository.getObtained(user,obtained[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toEqual(obtained[0])
  });

  it("remove obtained by hash and card_id", async () => {
    const obtained=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue();
  
    const result = await obtainedRepository.removeObtained(user,obtained[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeUndefined()
  });

  it("get obtained with no results", async () => {
    const obtained=[{id:"fav1",card_id:"card-123"}]
    const user = "abc123";
  
    db.query.mockResolvedValue({rows:[]});
  
    const result = await obtainedRepository.getObtained(user,obtained[0].card_id);
  
    expect(db.query).toHaveBeenCalled();
    expect(result).toBeNull()
  });
});
