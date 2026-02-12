import { describe, it, expect, vi } from "vitest";
import * as cardsController from "../../../src/controllers/cards.controller.js";
import * as cardsService from "../../../src/services/cards.service.js";
import * as mock from "../../helpers/mockResponse.js"

vi.mock("../../../src/services/cards.service.js");

describe("Cards controller", () => {
    it("should return cards when found", async () => {
        const req = { query: {id:1, name: "Pikachu" } };
        const res = mock.mockResponse();
      
        const card = { id: 1, name: "Pikachu" };
      
        cardsService.searchCardsByName.mockResolvedValue(card);
      
        await cardsController.searchCards(req, res);
      
        expect(cardsService.searchCardsByName).toHaveBeenCalledWith("Pikachu");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(card);
      });
      
      it("should return 404 if card not found", async () => {
        const req = { query: { name: "Pikachu" } };
        const res = mock.mockResponse();
      
        cardsService.searchCardsByName.mockRejectedValue(new Error("Card not found"));
      
        await cardsController.searchCards(req, res);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Card not found" });
      });
})
