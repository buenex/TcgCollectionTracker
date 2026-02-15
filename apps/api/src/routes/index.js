import { Router } from "express";
import cardRoutes from "./cards.routes.js";
import userRoutes from "./users.routes.js";
import favoriteRoutes from "./favorites.routes.js";
import obtainedRoutes from "./obtained.routes.js";

const router = Router();

router.use("/cards", cardRoutes);
router.use("/users", userRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/obtained", obtainedRoutes);

export default router;
