import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { register, login, logout, me } from "./admin.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, authorize(["Admin"]), logout);
router.get("/me", protectRoute, authorize(["Admin"]), me);

export default router;
