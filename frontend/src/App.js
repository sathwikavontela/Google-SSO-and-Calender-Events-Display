import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authToken = query.get("token");
    if (authToken) {
      setToken(authToken);
      fetchEvents(authToken);
    }
  }, []);

  const fetchEvents = async (accessToken) => {
    try {
      const res = await axios.get(`http://localhost:5000/events?accessToken=${accessToken}`);
      const events = res.data.items || [];
      setEvents(events);
      setFilteredEvents(events);
    } catch (err) {
      console.error(err);
    }
  };

  const filterEventsByDate = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      return eventDate.toDateString() === date.toDateString();
    });
    setFilteredEvents(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Google Calendar Events</h1>
      {!token ? (
        <a
          href="http://localhost:5000/auth/google"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login with Google
        </a>
      ) : (
        <>
          <div className="mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => filterEventsByDate(date)}
              className="border p-2 rounded"
              placeholderText="Filter by date"
            />
          </div>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border px-4 py-2">Event</th>
                <th className="border px-4 py-2">Start</th>
                <th className="border px-4 py-2">End</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="border px-4 py-2">{event.summary}</td>
                  <td className="border px-4 py-2">{event.start.dateTime || event.start.date}</td>
                  <td className="border px-4 py-2">{event.end.dateTime || event.end.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
