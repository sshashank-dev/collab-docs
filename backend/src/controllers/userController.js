const User = require("../models/User");

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            user,
        });
    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    getMe,
};