import * as usersRepo from "../repositories/users.repository.js";

export async function getOrCreateUser(hash) {
  let user = await usersRepo.findByHash(hash);

  if (!user) {
    user = await usersRepo.create(hash);
  }

  return user;
}

export async function deleteUser(hash) {
  return {deleted: await usersRepo.deleteUser(hash)};
}