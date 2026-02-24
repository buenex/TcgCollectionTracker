import { Router } from "express";
import * as controller from "../controllers/obtained.controller.js";

const router = Router({ mergeParams: true });

router.get("/:hash", controller.listObtained);
router.post("/:hash/:cardId", controller.add);
router.delete("/:hash/:cardId", controller.remove);

export default router;
