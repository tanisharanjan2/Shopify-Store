const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const authMiddleware = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tenantId } = req; 
    const { eventName, details } = req.body;

    if (!eventName) {
      return res.status(400).json({ msg: 'Event name is required.' });
    }

    
    const newEvent = await Event.create({
      tenantId,
      eventName,
      details: details || {}, 
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;