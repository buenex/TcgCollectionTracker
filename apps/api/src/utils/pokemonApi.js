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
        image: full.image?full.getImageURL("high","webp"):null,
        rarity: full.rarity ?? null,
        code: `${full.id.split("-")[1]}/${full.set?.cardCount?.official??null}`,
        set_id: full.set?.id ?? null,
        set_name: full.set?.name ?? null
      };
    })
  );

  return detailedCards;
}

export async function searchCardById(id) {
  const cards = await tcgdex.card.list(
    Query.create().equal('id', id)
  );
  const detailedCards = await Promise.all(
    cards.map(async (card) => {
      const full = await tcgdex.card.get(card.id);

      return {
        id: full.id,
        name: full.name,
        image: full.image?full.getImageURL("high","webp"):null,
        rarity: full.rarity ?? null,
        code: `${full.id.split("-")[1]}/${full.set?.cardCount?.official??null}`,
        set_id: full.set?.id ?? null,
        set_name: full.set?.name ?? null
      };
    })
  );

  return detailedCards;
}
