import * as pokemonApi from "../utils/pokemonApi.js";
import * as cache from "../utils/cache.js";
import { AppError } from "../utils/appError.js";
import * as cardsRepo from "../repositories/cards.repository.js";

export async function searchCardsByName(name) {
  const key = buildNameKey(name);

  const prefixHit = await findBestPrefixInCache(name);

  if (prefixHit) {
    const filtered = filterCards(prefixHit.cards, name);

    await clearMoreSpecificCaches(name);

    return filtered;
  }

  const response = await pokemonApi.searchCards(name);
  const cards = response ?? [];

  if (cards.length === 0) {
    throw new AppError("Card not found", 404);
  }

  await cardsRepo.insertCards(cards);
  await cache.set(key, cards);
  clearMoreSpecificCaches(name)
  return cards;
}

export async function searchCardsById(id) {

  const response = await pokemonApi.searchCardById(id);
  const cards = response ?? [];

  if (cards.length === 0) {
    throw new AppError("Card not found", 404);
  }

  await cardsRepo.insertCards(cards);
  await cache.set(id, cards);

  return cards;
}

export async function getAllCards() {

  return await cardsRepo.listCards();
}

function filterCards(cards, term) {
  const t = term.toLowerCase();
  return cards.filter(c => c.name?.toLowerCase().includes(t));
}

async function findBestPrefixInCache(name) {
  const lower = name.toLowerCase();

  for (let i = lower.length; i > 0; i--) {
    const prefix = lower.slice(0, i);
    const cached = await cache.get(buildNameKey(prefix));

    if (cached) {
      return { prefix, cards: cached };
    }
  }

  return null;
}

function buildNameKey(name) {
  return `cards:${name.toLowerCase()}`;
}

async function clearMoreSpecificCaches(name) {
  const lower = name.toLowerCase();

  const keys = await cache.keys?.(`cards:${lower}*`);
  if (!keys) return;

  for (const k of keys) {
    if (k !== buildNameKey(name)) {
      await cache.del(k);
    }
  }
}