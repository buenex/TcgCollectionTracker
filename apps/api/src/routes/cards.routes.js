import { Router } from "express";
import { searchCards,getAllSavedCards } from "../controllers/cards.controller.js";

const router = Router();

router.get("/", searchCards);
router.get("/all", getAllSavedCards);

export default router;
