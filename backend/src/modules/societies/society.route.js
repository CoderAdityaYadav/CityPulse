import express from "express";
import protectRoute from "../../middlewares/protectRoute.middleware.js";
import { getSocieties,getSociety,createSociety,joinSociety,postProfileSociety } from "./society.controller.js";
import upload from "../../config/multer.js";
import { uploadMultiple } from "../../config/uploadMultiple.js";

const router = express.Router();

router.get("/", getSocieties);
router.get("/:id", protectRoute, getSociety);

router.post("/", protectRoute, createSociety);
router.post("/:id/profile", protectRoute, upload.array('images', 1), uploadMultiple, postProfileSociety);
router.post("/join", protectRoute, joinSociety);

export default router;