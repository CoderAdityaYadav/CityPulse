import Issue from "../../models/Issue.js";
// import User from "../../models/User.js";

const handleServerError = (res, error, controllerName) => {
    console.error(`Error in ${controllerName} controller:`, error);
    return res.status(500).json({
        success: false,
        message: `An internal server error occurred in ${controllerName}: ${error.message}`,
    });
};

export async function getIssues(req, res) {
    try {
        const { category, status, societyId } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (societyId) filter.societyId = societyId;
        const issues = await Issue.find(filter).sort({ createdAt: -1 }).limit(100);
        res.status(200).json({ success: true, data: issues });
    } catch (error) {
        handleServerError(res, error, "getIssues");
    }
}

export async function getIssue(req, res) {
    try {
        const id = req.params.id;
        const issue = await Issue.findById(id);
        if (!issue) return res.status(400).json({ success: false, message: "No such Issue" });
        return res.status(200).json({ success: true, data: issue });
    } catch (error) {
        handleServerError(res, error, "getIssue");
    }
}

export async function postIssue(req, res) {
    try {
        const { title, description, location, societyId } = req.body;
        const images = req.images || [];
        // const ai = await classifyIssue(description || title || "");
        const issue = await Issue.create({
            userId: req.user._id,
            societyId: societyId,
            title, description,
            category: "general",
            // replace this both with ai.category and ai.priority
            priority:"low" ,
            location,
            images
        })
        res.status(200).json({ success: true, data: issue });
    } catch (error) {
        handleServerError(res, error, "postIssue");
    }
}

export async function updateIssue(req, res) {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(400).json({ success: false, message: "No such issue" });
        const updates = req.body;
        Object.assign(issue, updates);
        await issue.save();
        return res.status(200).json({ success: true, data: issue });
        } catch (error) {
        handleServerError(res, error, "updateIssue");
    }
}

export async function upvoteIssue(req, res) {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(400).json({
                success: false,
                message: "No such Issue",
            });
        }
        const userId = req.user._id;
        const has = issue.upvotes.some(
            (u) => u.toString() === userId.toString()
        );
        if (has) {
            issue.upvotes = issue.upvotes.filter(
                (u) => u.toString() !== userId.toString()
            );
        } else {
            issue.upvotes.push(userId);
        }
        await issue.save();
        return res.status(200).json({
            success: true,
            data: { upvotes: issue.upvotes.length },
        });
    } catch (error) {
        handleServerError(res, error, "upvoteIssue");
    }
}