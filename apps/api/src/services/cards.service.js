import * as pokemonApi from "../utils/pokemonApi.js";
import * as cache from "../utils/cache.js";

export async function searchCardsByName(name) {
  const cacheKey = `cards:${name}`;

  // 1️⃣ tenta cache
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2️⃣ chama API externa
  const cards = await pokemonApi.searchCards(name);

  // 3️⃣ salva no cache
  await cache.set(cacheKey, JSON.stringify(cards), 60 * 60); // 1h

  return cards;
}
