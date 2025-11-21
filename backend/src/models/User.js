import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        societyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Society",
            default: null,
        },
        role: {
            type: String,
            enum: ["citizen", "moderator", "admin"],
            default: "citizen",
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function next() {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return next(error);
    }
})

export default mongoose.model("User", userSchema);