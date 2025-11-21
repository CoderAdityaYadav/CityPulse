import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
}
function sendToken(res, token) {
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User does not exist." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Incorrect Password or email",
                });
        const token = generateToken(user._id);
        sendToken(res, token);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in login controller :" + error.message,
        });
    }
}

export async function signup(req, res) {
    try {
        const { email, password, fullName, role, phone } = req.body;
        if (!email || !password || !fullName) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email is not valid" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        const newUser = await User.create({
            email,
            password,
            fullName,
            role,
            phone,
        });
        if (!newUser)
            return res
                .status(500)
                .json({
                    success: false,
                    message: "User was not created.Try again later",
                });
        const token = generateToken(newUser._id);
        if (!token)
            return res
                .status(500)
                .json({
                    success: true,
                    message: "Token could not be generated",
                });
        sendToken(res, token);
        res.status(200).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in signup controller :" + error.message,
        });
    }
}

export async function logout(req,res) {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ success: true, message: "Logout Successfull" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in logout controller :" + error.message,
        });
    }
}