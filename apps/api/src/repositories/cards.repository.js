import db from "../config/db.js";

export async function insertCards(cards) {
    if (!cards.length) return;
  
    const values = [];
    const params = [];
  
    cards.forEach((card, index) => {
      const baseIndex = index * 6;
  
      values.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`
      );
  
      params.push(
        card.card_id,
        card.name,
        card.images.small,
        card.rarity,
        card.set.id,
        card.set.name
      );
    });
  
    const query = `
      INSERT INTO cards (
        card_id,
        card_name,
        card_url,
        rarity,
        set_id,
        set_name
      )
      VALUES ${values.join(",")}
      ON CONFLICT DO NOTHING
    `;

    await db.query(query, params);
  }
  
export async function removeCard(cardId) {
  await db.query(
    "DELETE FROM cards WHERE card_id = $1",
    [cardId]
  );
}

export async function listCards() {
  const { rows } = await db.query(
    "SELECT * FROM cards"
  );

  return rows.map(r => r.card_id);
}

export async function listCardsByName(name) {
    const { rows } = await db.query(
      "SELECT * FROM cards WHERE card_name ILIKE '%' || $1 || '%'",
      [name]
    );
  
    return rows.map(r => r.name);
  }

  export async function listCardsById(id) {
    const { rows } = await db.query(
      "SELECT * FROM cards WHERE card_id ILIKE '%' || $1 || '%'",
      [id]
    );
  
    return rows.map(r => r.id);
  }

  export async function searchCards(term) {
    const { rows } = await db.query(
      `
      SELECT *
      FROM cards
      WHERE card_id ILIKE '%' || $1 || '%'
         OR card_name ILIKE '%' || $1 || '%'
      `,
      [term]
    );
  
    return rows;
  }
