import { Router } from "express";
import { createUser,deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/:hash", createUser);
router.delete("/:hash", deleteUser);


export default router;
