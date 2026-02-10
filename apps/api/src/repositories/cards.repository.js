import db from "../config/db.js";

export async function addFavorite(userId, cardId) {
  await db.query(
    "INSERT INTO favorite_cards (user_id, card_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userId, cardId]
  );
}

export async function removeFavorite(userId, cardId) {
  await db.query(
    "DELETE FROM favorite_cards WHERE user_id = $1 AND card_id = $2",
    [userId, cardId]
  );
}

export async function listFavorites(userId) {
  const { rows } = await db.query(
    "SELECT card_id FROM favorite_cards WHERE user_id = $1",
    [userId]
  );

  return rows.map(r => r.card_id);
}
