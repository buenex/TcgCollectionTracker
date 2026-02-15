import db from "../config/db.js";

export async function addObtained(userHash, cardId) {
  await db.query(
    "INSERT INTO obtained_cards (user_hash, card_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userHash, cardId]
  );
}

export async function removeObtained(userHash, cardId) {
  await db.query(
    "DELETE FROM obtained_cards WHERE user_hash = $1 AND card_id = $2",
    [userHash, cardId]
  );
}

export async function listObtained(userHash) {
  const { rows } = await db.query(
    "SELECT card_id FROM obtained_cards WHERE user_hash = $1",
    [userHash]
  );

  return rows.map(r => r.card_id);
}

export async function getObtained(userHash, cardId) {
  const { rows } = await db.query(
    "SELECT card_id FROM obtained_cards WHERE user_hash = $1 AND card_id = $2",
    [userHash, cardId]
  );

  return rows[0] ?? null;
}
