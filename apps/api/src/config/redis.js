import { createClient } from "redis";

const ttlSeconds = Number(process.env.REDIS_TTL) || 129600;

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

let isConnected = false;

async function connect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

export async function get(key) {
  await connect();

  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function set(key, value, ttl = ttlSeconds) {
  await connect();

  await client.set(key, JSON.stringify(value), {
    EX: ttl,
  });
}

export async function del(key) {
    await connect();
    await client.del(key);
  }

  export async function keys(key) {
    await connect();
  
    return client.keys(key)
  }
