import * as cardsService from "../services/cards.service.js";

export async function searchCards(req, res, next) {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const cards = await cardsService.searchCardsByName(name);

    res.json(cards);
  } catch (err) {
    next(err);
  }
}
