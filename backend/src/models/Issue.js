import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Society",
        default: null
    },
    title: {
        type:String,required:true,
    }, description: {
        type:String,
    },
    priority: {
        type: String,
        enum:["low","medium","high"],default:"low"
    },
    category: {
        type: String,
        default:"general"
    },
    status: {
        type: String,
        enum:["pending","in-progress","resolved"],default:"pending"
    }, location: {
        lat: Number,
        lng:Number,address:String
    }, images: [String],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt:{type:Date,default:Date.now}
})

export default mongoose.model("Issue", issueSchema);