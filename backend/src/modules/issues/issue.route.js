import express from "express";
import { getIssue,getIssues,postIssue,updateIssue,upvoteIssue } from "./issue.controller.js";
import protectRoute from "../../middlewares/protectRoute.middleware.js";
import upload from "../../config/multer.js";
import { uploadMultiple } from "../../config/uploadMultiple.js";

const router = express.Router();

router.get("/", getIssues);
router.get("/:id", getIssue);
router.post("/", protectRoute,upload.array('images',4),uploadMultiple, postIssue);
router.post("/:id", protectRoute, updateIssue);
router.post("/:id/upvote", protectRoute, upvoteIssue);

export default router;