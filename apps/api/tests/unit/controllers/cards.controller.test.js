import { describe, it, expect, vi } from "vitest";
import * as cardsController from "../../../src/controllers/cards.controller.js";
import * as cardsService from "../../../src/services/cards.service.js";
import * as mock from "../../helpers/mockResponse.js"

vi.mock("../../../src/services/cards.service.js");

describe("Cards controller", () => {
    it("should return card when found", async () => {
        const req = { params: { id: "1" } };
        const res = mock.mockResponse();
      
        const card = { id: 1, name: "Pikachu" };
      
        cardsService.searchCardsByName.mockResolvedValue(card.name);
      
        await cardsController.searchCards(req, res);
      
        expect(cardsService.getCardById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(card);
      });
      
      it("should return 404 if card not found", async () => {
          const req = { params: { id: "1" } };
          const res = mock.mockResponse();
        
          cardsService.searchCardsByName.mockRejectedValue(new Error("Card not found"));
        
          await cardsController.searchCards(req, res);
        
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ error: "Card not found" });
    });
})
