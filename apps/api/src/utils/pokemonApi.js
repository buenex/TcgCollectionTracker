const BASE_URL = "https://api.pokemontcg.io/v2/cards";

export async function searchCards(name) {
  const res = await fetch(`${BASE_URL}?q=name:${name}`, {
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
