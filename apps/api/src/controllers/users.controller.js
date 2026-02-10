import * as usersService from "../services/users.service.js";

/**
 * POST /users
 */
export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);

    return res.status(201).json(user);
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /users/:hash/cards
 */
export async function getUserCards(req, res) {
  try {
    const { hash } = req.params;

    const cards = await usersService.getUserCards(hash);

    return res.status(200).json(cards);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /users/:hash/favourites
 */
export async function getUserFavourites(req, res) {
  try {
    const { hash } = req.params;

    const favourites = await usersService.getUserFavourites(hash);

    return res.status(200).json(favourites);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /users/:hash/obtained
 */
export async function getUserObtained(req, res) {
  try {
    const { hash } = req.params;

    const obtained = await usersService.getUserObtained(hash);

    return res.status(200).json(obtained);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
