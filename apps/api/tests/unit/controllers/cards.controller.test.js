vi.mock("../../../src/services/cards.service.js");
vi.mock("../../../src/utils/pokemonApi.js", () => ({
  getCard: vi.fn()
}));

import { describe, it, expect, vi } from "vitest";
import * as cardsController from "../../../src/controllers/cards.controller.js";
import * as cardsService from "../../../src/services/cards.service.js";
import * as mock from "../../helpers/mockResponse.js";


describe("Cards controller", () => {
    it("should return cards when found", async () => {
        const req = { query: {id:1, name: "Pikachu" } };
        const res = mock.mockResponse();
        const next = vi.fn();
      
        const card = { id: 1, name: "Pikachu" };
      
        cardsService.searchCardsByName.mockResolvedValue(card);
      
        await cardsController.searchCards(req, res, next);
      
        expect(cardsService.searchCardsByName).toHaveBeenCalledWith("Pikachu");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(card);
      });
      
      it("should call next with error if card not found", async () => {
        const req = { query: { name: "Pikachu" } };
        const res = mock.mockResponse();
        const next = vi.fn();
      
        const error = new Error("Card not found");
        error.statusCode = 404;
      
        cardsService.searchCardsByName.mockRejectedValue(error);
      
        await cardsController.searchCards(req, res, next);
      
        expect(next).toHaveBeenCalledWith(error);
      });
})
