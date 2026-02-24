import { Router } from "express";
import * as controller from "../controllers/favorites.controller.js";

const router = Router({ mergeParams: true });

router.get("/:hash", controller.listFavorites);
router.post("/:hash/:cardId", controller.add);
router.delete("/:hash/:cardId", controller.remove);

export default router;
