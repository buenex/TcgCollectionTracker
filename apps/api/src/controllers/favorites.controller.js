import * as favoritesService from "../services/favorites.service.js";

export async function list(req, res, next) {
  try {
    const { hash } = req.params;

    const favorites = await favoritesService.listFavorites(hash);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const { hash, cardId } = req.params;

    await favoritesService.addFavorite(hash, cardId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { hash, cardId } = req.params;

    await favoritesService.removeFavorite(hash, cardId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
