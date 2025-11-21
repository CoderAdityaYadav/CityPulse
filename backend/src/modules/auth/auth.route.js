import express from "express";
import { login, signup, logout } from "./auth.controller.js";
import protectRoute from "../../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", protectRoute, (req,res) => {
    res.status(200).json({ success: true, data: req.user });
})

export default router;