import * as usersService from "./users.service.js";
import * as obtainedRepo from "../repositories/obtained.repository.js";
import { AppError } from "../utils/appError.js";

export async function listObtained(userHash) {
  const user = await usersService.getOrCreateUser(userHash);
  return obtainedRepo.listObtained(user.hash);
}

export async function addObtained(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const obtained = await obtainedRepo.listObtained(user.hash);

  const exists = obtained.includes(cardId);
  if (exists) {
    throw new AppError("Card obtained already saved!", 409);
  }

  await obtainedRepo.addObtained(user.hash, cardId);
}

export async function removeObtained(userHash, cardId) {
  const user = await usersService.getOrCreateUser(userHash);

  const exists = await obtainedRepo.getObtained(user.hash, cardId);
  if (!exists) {
    throw new AppError("Obtained not found", 404);
  }

  await obtainedRepo.removeObtained(user.hash, cardId);
}