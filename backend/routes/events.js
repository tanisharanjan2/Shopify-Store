const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const authMiddleware = require('../middleware/auth');

// POST /api/events
// This route will receive and save any custom event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tenantId } = req; // Get the tenant from the secure token
    const { eventName, details } = req.body;

    if (!eventName) {
      return res.status(400).json({ msg: 'Event name is required.' });
    }

    // Create the new event in the database
    const newEvent = await Event.create({
      tenantId,
      eventName,
      details: details || {}, // 'details' can be any JSON object
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;