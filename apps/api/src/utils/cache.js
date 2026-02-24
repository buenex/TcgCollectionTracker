import * as redis from "../config/redis.js";

export async function get(key) {
  return redis.get(key);
}

export async function set(key, value) {
  return redis.set(key, value);
}

export async function del(key) {
  return redis.del?.(key);
}

export async function keys(key){
  return redis.keys(key)
}
