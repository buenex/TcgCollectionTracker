import * as pokemonApi from "../utils/pokemonApi.js";
import * as cache from "../utils/cache.js";

export async function searchCardsByName(name) {
  const cacheKey = `cards:${name}`;
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const cards = await pokemonApi.searchCards(name);

  if (!cards || cards.length === 0) {
    throw new Error("Card not found");
  }

  await cache.set(cacheKey, JSON.stringify(cards), 60 * 60);

  return cards;
}

export async function searchCardById(id) {
  const cacheKey = `cards:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const card = await pokemonApi.searchCardById(id);

  if (!card) {
    throw new Error("Card not found");
  }

  await cache.set(cacheKey, JSON.stringify(card), 60 * 60);

  return card;
}

export async function favoriteCard(userId, cardId) {
  const cacheKey = `cards:${cardId}`;

  let card = await cache.get(cacheKey);
  if (card) {
    card = JSON.parse(card);
  } else {
    card = await pokemonApi.searchCardById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    await cache.set(cacheKey, JSON.stringify(card), 60 * 60);
  }

  const alreadyFavorited = await cardsRepo.getFavorite(userId,cardId);

  if (alreadyFavorited) {
    throw new Error("Card already favorited");
  }
  await cardsRepo.addFavorite({
    user_id: userId,
    card_id: cardId,
  });
  return card;
}
