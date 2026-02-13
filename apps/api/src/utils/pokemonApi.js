import TCGdex, { Query } from '@tcgdex/sdk'

const tcgdex = new TCGdex('pt');

export async function searchCards(name) {
  const cards = await tcgdex.card.list(
    Query.create().contains('name', name)
  );

  const detailedCards = await Promise.all(
    cards.map(async (card) => {
      const full = await tcgdex.card.get(card.id);

      return {
        id: full.id,
        name: full.name,
        image: full.image+"/low.webp",
        rarity: full.rarity ?? null,
        set_id: full.set?.id ?? null,
        set_name: full.set?.name ?? null
      };
    })
  );

  return detailedCards;
}

export async function searchCardById(id) {
  const res = await fetch(`${BASE_URL}?q=id:${id}`, {
    headers: {
      "X-Api-Key": process.env.POKEMON_TCG_API_KEY
    }
  });

  if (!res.ok) {
    throw new Error("Pokemon API error");
  }

  const data = await res.json();
  return data.data;
}
