import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js"
import authRoutes from "./modules/auth/auth.route.js"
import issueRoutes from "./modules/issues/issue.route.js"
import societyRoutes from "./modules/societies/society.route.js"

const app = express();
dotenv.config();
const PORT=process.env.PORT || 3000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "process.env.FRONTEND_URL",
    credentials:true
}));

app.use("/api/auth", authRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/society", societyRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running✅ on PORT ${PORT}`);
})