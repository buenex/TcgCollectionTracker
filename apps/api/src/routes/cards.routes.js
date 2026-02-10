import { Router } from "express";
import { searchCards } from "../controllers/cards.controller.js";

const router = Router();

router.get("/", searchCards);

export default router;
