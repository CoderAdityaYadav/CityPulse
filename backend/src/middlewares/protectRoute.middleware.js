import User from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function protectRoute(req,res,next) {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ success: false, message: "Not Authorized" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) return res.status(401).json("User not found");
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
}