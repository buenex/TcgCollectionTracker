import * as usersService from "./users.service.js";
import * as favoritesRepo from "../repositories/favorites.repository.js";
import { AppError } from "../utils/appError.js";

export async function listFavorites(userHash) {
  const user = await usersService.getOrCreateUser(userHash);
  return favoritesRepo.listByUser(user.hash);
}

export async function addFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const favorites = await favoritesRepo.listByUser(user.id);

  const exists = favorites.includes(cardId);
  if (exists) {
    throw new AppError("Card already favorited", 409);
  }

  await favoritesRepo.add(user.id, cardId);
}

export async function removeFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const exists = await favoritesRepo.get(user.id, cardId);
  if (!exists) {
    throw new AppError("Favorite not found", 404);
  }

  await favoritesRepo.remove(user.id, cardId);
}