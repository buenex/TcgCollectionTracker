import * as pokemonApi from "../utils/pokemonApi.js";
import * as cache from "../utils/cache.js";
import { AppError } from "../utils/appError.js";
import * as cardsRepo from "../repositories/cards.repository.js";

export async function searchCardsByName(name) {
  const cacheKey = `cards:name:${name}`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const db = await cardsRepo.listCardsByName(name);
  if (db) return JSON.parse(db);

  const response = await pokemonApi.searchCards(name);
  const cards = response?.data ?? [];

  if (cards.length === 0) {
    throw new AppError("Card not found", 404);
  }

  await cardsRepo.insertCards(cards);
  await cache.set(cacheKey, JSON.stringify(cards), 60 * 60);

  return cards;
}


export async function searchCardById(id) {
  const cacheKey = `cards:id:${id}`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const db = await cardsRepo.listCardsByName(id);
  if (db) return JSON.parse(db);

  const response = await pokemonApi.searchCardById(id);
  const card = response?.data;

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  await cardsRepo.insertCards([card]);
  await cache.set(cacheKey, JSON.stringify(card), 60 * 60);

  return card;
}
