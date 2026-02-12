import { Router } from "express";
import favoritesRoutes from "./favorites.routes.js";

const router = Router();

router.use("/:hash/favorites", favoritesRoutes);

export default router;
