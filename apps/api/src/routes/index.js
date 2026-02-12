import { Router } from "express";
import cardRoutes from "./cards.routes.js";
import userRoutes from "./users.routes.js";
import favouriteRoutes from "./favorites.routes.js";

const router = Router();

router.use("/cards", cardRoutes);
router.use("/users", userRoutes);
router.use("/favourites", favouriteRoutes);

export default router;
