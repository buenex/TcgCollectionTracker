import { Router } from "express";
import * as controller from "../controllers/favorites.controller.js";

const router = Router({ mergeParams: true });

router.get("/", controller.list);
router.post("/:cardId", controller.add);
router.delete("/:cardId", controller.remove);

export default router;
