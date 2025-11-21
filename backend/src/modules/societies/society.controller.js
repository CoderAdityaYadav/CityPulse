import User from "../../models/User.js";
import Society from "../../models/Society.js";
import crypto from "crypto";

function genCode() {
    return crypto.randomBytes(3).toString("hex");
}

const handleServerError = (res, error, controllerName) => {
    console.error(`Error in ${controllerName} controller:`, error);
    return res.status(500).json({
        success: false,
        message: `An internal server error occurred in ${controllerName}: ${error.message}`,
    });
};

export async function getSocieties(req, res) {
    try {
        const societies = await Society.find().limit(100).select("-members -code").populate("moderators","fullName email");
        res.status(200).json({ success: true, data: societies });
    } catch (error) {
        handleServerError(res, error, "getSocieties");
    }
}

export async function getSociety(req, res) {
    try {
        const societyId = req.params.id;

        const society = await Society.findById(societyId)
            .populate("members", "fullName email")
            .populate("moderators", "fullName email");

        if (!society) {
            return res
                .status(404)
                .json({ success: false, message: "Society Not found" });
        }

        const userIdString = req.user._id.toString();

        const isMember = society.members.some(
            (member) => member._id.toString() === userIdString
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message:
                    "Forbidden: You are not a member of this society to view details",
            });
        }

        return res.status(200).json({ success: true, data: society });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                success: false,
                message: "Invalid Society ID format.",
            });
        }
        handleServerError(res, error, "getSociety");
    }
}


export async function createSociety(req, res) {
    try {
        const { name, address } = req.body;
        if (!name || !address) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Name and address are required.",
                });
        }
        const code = genCode();
        const society = await Society.create({
            name,
            address,
            code,
            members: [req.user._id],
            moderators: [req.user._id], 
        });
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { societyId: society._id },
            { new: true } 
        );
        if (!updatedUser) {
            console.warn(
                `User ID ${req.user._id} not found during society update.`
            );
        }
        res.status(201).json({
            success: true,
            message: "Society was created successfully.",
            data: society,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }
        handleServerError(res, error, "createSociety");
    }
}

export async function joinSociety(req, res) {
    try {
        const { id, code } = req.body;
        if (!id || !code) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Code is required.",
                });
        }
        const society = await Society.findById(id);
        if (!society || society.code!=code) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Code",
                });
        }
        if (society.members.includes(req.user._id)) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: "You are already a member of this society.",
                    data: society,
                });
        }
        society.members.push(req.user._id);
        await society.save();
        await User.findByIdAndUpdate(
            req.user._id,
            { societyId: society._id },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Society was joined successfully.",
            data: society,
        });
    } catch (error) {
        handleServerError(res, error, "joinSociety");
    }
}

export async function postProfileSociety(req, res) {
    try {
        const images = req.images;
        console.log("Image link:"+images[0]);
        const societyId = req.params.id;
        const society = await Society.findById(societyId);
        society.profilePhoto = images[0];
        await society.save();
        res.status(200).json({ success: true,data:society, message: "Profile Photo of Society was updated successfully." });
    } catch (error) {
        handleServerError(res, error, "joinSociety");
    }
}