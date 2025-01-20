const express = require("express");
const {createEvent,getEvents, updateEvent, deleteEvent} = require("../controller/Event.controller.js")

const router = express.Router();
router.post('/create-event', createEvent);
router.get('/get-events',getEvents);
router.put('/update-event/:eventId',updateEvent);
router.delete('/delete-event/:eventId',deleteEvent)

module.exports = router;