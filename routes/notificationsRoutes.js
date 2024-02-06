const express = require('express');
const router = express.Router();
const Notifications = require('../models/notifications.js');
const authentication = require('../middleware/authentication.js');

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

module.exports = router;
