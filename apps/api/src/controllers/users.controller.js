import * as usersService from "../services/users.service.js";


/**
 * POST /users
 */
export async function createUser(req, res, next) {
  try {
    const { hash } = req.params;

    const user = await usersService.getOrCreateUser(hash);

    return res.status(200).json(user);
  } catch (err) {
    next(err)
  }
}

/**
 * GET /users/:hash/cards
 */
export async function getUserCards(req, res,next) {
  try {
    const { hash } = req.params;

    const cards = await usersService.getUserCards(hash);

    return res.status(200).json(cards);
  } catch (err) {
    next(err)
  }
}


export async function deleteUser(req, res, next) {
  try {
    const { hash } = req.params;

    const deleted = await usersService.deleteUser(hash);

    if (!deleted) {
      return res.status(404).json({ deleted: false });
    }

    return res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

