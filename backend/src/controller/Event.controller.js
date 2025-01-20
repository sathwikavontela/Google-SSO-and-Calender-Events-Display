const Event = require('../models/Events.model.js');

const createEvent = async (req, res) => {
  const { eventName, date, time, location } = req.body;

  if (!eventName || !date || !time) {
    return res.status(400).json({ error: "Event name, date, and time are required" });
  }

  try {
    const newEvent = new Event({
      eventName,
      date,
      time,
      location,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ error: "Error creating event" });
  }
};

const { google } = require("googleapis");

const getEvents = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, error: "Access token is required" });
    }

    const calendar = google.calendar({ version: "v3", auth: token });

    const events = await calendar.events.list({
      calendarId: "primary",
      orderBy: "startTime",
      singleEvents: true,
    });

    res.status(200).json({ success: true, events: events.data.items });
  } catch (error) {
    console.error("Error while fetching events:", error.message);
    res.status(500).json({ success: false, error: "Error fetching events" });
  }
};

const updateEvent = async(req,res)=>{
  try {
    const {eventId} = req.params;
    const {eventName,date,time,location} = req.body;
    if(!eventName && !date && !time && !location)
    {
        return res.status(400).json({error:"Atleast one field is required"});
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId,
      {eventName,date,time,location},
      {new:true, runValidators:true}
    )
    if(!updatedEvent)
    {
      return res.status(404).json({error:"Event not found"});
    }
    res.status(200).json({message:"Event updated successfully",updatedEvent});
    
  } catch (error) {
    console.log("Error while updating the event",error.message);
    res.status(500).json({error:"Error updating event"});
    
  }

}

const deleteEvent = async(req,res)=>{
  try {
    const {eventId} = req.params;
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if(!deletedEvent)
    {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted successfully", deletedEvent });

    
  } catch (error) {
    console.error("Error while deleting the event:", error.message);
    res.status(500).json({ success: false, error: "Error deleting event" });
    
  }

}




module.exports = {createEvent,getEvents,updateEvent,deleteEvent};
