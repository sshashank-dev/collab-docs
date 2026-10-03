const Notification = require("../models/Notification");

/* GET USER NOTIFICATIONS */
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.userId,
        })
            .populate("sender", "name email avatar")
            .populate("document", "title")
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            notifications,
        });
    } catch (error) {
        console.error(
            "❌ Get notifications error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch notifications",
        });
    }
};

/* MARK ONE NOTIFICATION AS READ */
const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    recipient: req.userId,
                },
                {
                    read: true,
                },
                {
                    new: true,
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error(
            "❌ Mark notification error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update notification",
        });
    }
};

/* MARK ALL NOTIFICATIONS AS READ */
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.userId,
                read: false,
            },
            {
                read: true,
            }
        );

        return res.status(200).json({
            message:
                "All notifications marked as read",
        });
    } catch (error) {
        console.error(
            "❌ Mark all notifications error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update notifications",
        });
    }
};

/* DELETE NOTIFICATION */
const deleteNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndDelete({
                _id: req.params.id,
                recipient: req.userId,
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            message: "Notification deleted",
        });
    } catch (error) {
        console.error(
            "❌ Delete notification error:",
            error
        );

        return res.status(500).json({
            message: "Failed to delete notification",
        });
    }
};

/* CREATE NOTIFICATION */
const createNotification = async ({
    recipient,
    sender,
    document,
    type,
    message,
}) => {
    try {
        if (
            !recipient ||
            !sender ||
            !document ||
            !type ||
            !message
        ) {
            return null;
        }

        const notification =
            await Notification.create({
                recipient,
                sender,
                document,
                type,
                message,
            });

        return notification;
    } catch (error) {
        console.error(
            "❌ Create notification error:",
            error
        );

        return null;
    }
};



module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    createNotification,
};