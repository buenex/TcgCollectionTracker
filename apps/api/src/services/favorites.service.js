import * as usersService from "./users.service.js";
import * as favoritesRepo from "../repositories/favorites.repository.js";
import { AppError } from "../utils/appError.js";

export async function listFavorites(userHash) {
  const user = await usersService.getOrCreateUser(userHash);
  return favoritesRepo.listFavorites(user.hash);
}

export async function addFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const favorites = await favoritesRepo.listFavorites(user.hash);

  const exists = favorites.includes(cardId);
  if (exists) {
    throw new AppError("Card already favorited", 409);
  }

  await favoritesRepo.addFavorite(user.hash, cardId);
}

export async function removeFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const exists = await favoritesRepo.getFavorite(user.hash, cardId);
  if (!exists) {
    throw new AppError("Favorite not found", 404);
  }

  await favoritesRepo.removeFavorite(user.hash, cardId);
}