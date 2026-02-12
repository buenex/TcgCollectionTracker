import * as usersService from "../services/users.service.js";


/**
 * POST /users
 */
export async function createUser(req, res, next) {
  try {
    const { hash } = req.body;

    const user = await usersService.getOrCreateUser(hash);

    return res.status(201).json(user);
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

/**
 * GET /users/:hash/obtained
 */
export async function getUserObtained(req, res,next) {
  try {
    const { hash } = req.params;

    const obtained = await usersService.getUserObtained(hash);

    return res.status(200).json(obtained);
  } catch (err) {
    next(err)
  }
}
