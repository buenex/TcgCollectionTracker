import redis from "../config/redis.js";

export async function get(key) {
  return redis.get(key);
}

export async function set(key, value, ttlSeconds) {
  return redis.set(key, value, { EX: ttlSeconds });
}
