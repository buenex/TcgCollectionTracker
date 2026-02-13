import * as cardsService from "../services/cards.service.js"

export async function searchCards(req, res, next) {
  try {
    const { name } = req.query;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    const cards = await cardsService.searchCardsByName(name);

    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
}
