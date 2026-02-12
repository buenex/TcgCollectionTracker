import { describe, it, expect, vi } from "vitest";
import * as favoritesController from "../../../src/controllers/favorites.controller.js";
import * as favoritesService from "../../../src/services/favorites.service.js";
import { mockResponse } from "../../helpers/mockResponse.js";

vi.mock("../../../src/services/favorites.service.js");

describe("Favorites controller", () => {
  const next = vi.fn();

  describe("list", () => {
    it("should return favorites", async () => {
      const req = { params: { hash: "123" } };
      const res = mockResponse();
      const favorites = [1, 2, 3];

      favoritesService.listFavorites.mockResolvedValue(favorites);

      await favoritesController.list(req, res, next);

      expect(favoritesService.listFavorites).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(favorites);
    });

    it("should call next on error", async () => {
      const req = { params: { hash: "123" } };
      const res = mockResponse();
      const error = new Error("fail");

      favoritesService.listFavorites.mockRejectedValue(error);

      await favoritesController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("add", () => {
    it("should add favorite and return 204", async () => {
      const req = { params: { hash: "123", cardId: "10" } };
      const res = mockResponse();

      favoritesService.addFavorite.mockResolvedValue();

      await favoritesController.add(req, res, next);

      expect(favoritesService.addFavorite).toHaveBeenCalledWith("123", "10");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should call next on error", async () => {
      const req = { params: { hash: "123", cardId: "10" } };
      const res = mockResponse();
      const error = new Error("fail");

      favoritesService.addFavorite.mockRejectedValue(error);

      await favoritesController.add(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("remove", () => {
    it("should remove favorite and return 204", async () => {
      const req = { params: { hash: "123", cardId: "10" } };
      const res = mockResponse();

      favoritesService.removeFavorite.mockResolvedValue();

      await favoritesController.remove(req, res, next);

      expect(favoritesService.removeFavorite).toHaveBeenCalledWith("123", "10");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should call next on error", async () => {
      const req = { params: { hash: "123", cardId: "10" } };
      const res = mockResponse();
      const error = new Error("fail");

      favoritesService.removeFavorite.mockRejectedValue(error);

      await favoritesController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});