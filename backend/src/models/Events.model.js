const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
eventName: {
    type: String,
    required: true,
    },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, 
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: "Virtual", 
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
