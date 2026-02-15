import db from "../config/db.js";

export async function findByHash(hash) {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE hash = $1",
    [hash]
  );

  return rows[0];
}

export async function create(hash) {
  const { rows } = await db.query(
    "INSERT INTO users (hash) VALUES ($1) RETURNING *",
    [hash]
  );

  return rows[0];
}

export async function deleteUser(hash) {
  return await db.query(
    "DELETE FROM users WHERE hash = $1 ",
    [hash]
  );
}
