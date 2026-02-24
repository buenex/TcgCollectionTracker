import * as obtainedService from "../services/obtained.service.js";

export async function listObtained(req, res, next) {
  try {
    const { hash } = req.params;

    const favorites = await obtainedService.listObtained(hash);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const { hash, cardId } = req.params;

    await obtainedService.addObtained(hash, cardId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { hash, cardId } = req.params;

    await obtainedService.removeObtained(hash, cardId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
