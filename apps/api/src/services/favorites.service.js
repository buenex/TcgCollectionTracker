import * as usersService from "./users.service.js";
import * as favoritesRepo from "../repositories/favorites.repository.js";

export async function listFavorites(userHash) {
  const user = await usersService.getOrCreateUser(userHash);
  return favoritesRepo.listByUser(user.id);
}

export async function addFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);
  await favoritesRepo.add(user.id, cardId);
}

export async function removeFavorite(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);
  await favoritesRepo.remove(user.id, cardId);
}
