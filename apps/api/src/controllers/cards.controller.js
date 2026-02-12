import * as cardsService from "../services/cards.service"

export async function searchCards(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const cards = await cardsService.searchCardsByName(name);

    return res.status(200).json(cards);
  } catch (err) {
    if (err.message === "Card not found") {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}