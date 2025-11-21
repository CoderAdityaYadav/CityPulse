import express from "express";
import protectRoute from "../../middlewares/protectRoute.middleware.js";
import { getSocieties,getSociety,createSociety,joinSociety } from "./society.controller.js";

const router = express.Router();

router.get("/", getSocieties);
router.get("/:id",protectRoute, getSociety);
router.post("/", protectRoute, createSociety);
router.post("/join",protectRoute, joinSociety);

export default router;