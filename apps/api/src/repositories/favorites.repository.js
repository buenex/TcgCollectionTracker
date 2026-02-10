import db from "../config/db.js";

export async function add(userId, cardId) {
  await db.query(
    `INSERT INTO favorite_cards (user_id, card_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, cardId]
  );
}

export async function remove(userId, cardId) {
  await db.query(
    `DELETE FROM favorite_cards
     WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId]
  );
}

export async function listByUser(userId) {
  const { rows } = await db.query(
    `SELECT card_id
     FROM favorite_cards
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows.map(r => r.card_id);
}
