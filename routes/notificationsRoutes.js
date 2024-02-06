const express = require('express');
const router = express.Router();
const Notifications = require('../models/notifications.js');
const authentication = require('../middleware/authentication.js');
const { Op } = require('sequelize');

router.get('/', authentication, async (req, res) => {
    try {
        const notifications = await Notifications.findAll({
            where: {
                email: req.email
            }
        });

        if (notifications.length === 0) {
            // No notifications found
            return res.status(404).json({ message: "No notifications found" });
        } else {
            // Notifications found
            return res.status(200).json(notifications);
        }
    } catch (error) {
        // Error handling
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});







router.put('/', authentication, async (req, res) => {
    try {
        const notification = await Notifications.findOne({
            where: {
                id: req.query.id,
            }
        });

        if (!notification) {
            // Notification not found
            return res.status(404).json({ message: "Notification not found" });
        }

        // Update the view column to "yes"
        await notification.update({ view: 'yes' });

        // Find other notifications with the same email
        const otherNotifications = await Notifications.findAll({
            where: {
                email: req.email,
                id: { [Op.ne]: notification.id } // Exclude the current notification
            },
            order: [['createdAt', 'DESC']] // Assuming there's a createdAt column
        });

        // Check frequency
        if (otherNotifications.length > 10) {
            // Keep the top 10 recent notifications
            const notificationsToDelete = otherNotifications.slice(5);

            // Delete notifications
            await Notifications.destroy({
                where: {
                    id: notificationsToDelete.map(notification => notification.id)
                }
            });
        }

        return res.status(200).json({ message: "Notification updated successfully" });
    } catch (error) {
        // Error handling
        console.error("Error updating notification:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


module.exports = router;
