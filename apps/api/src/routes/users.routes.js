import { Router } from "express";
import { createUser, getUserCards,deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/:hash", createUser);
router.delete("/:hash", deleteUser);
router.use("/:hash/cards", getUserCards);


export default router;
