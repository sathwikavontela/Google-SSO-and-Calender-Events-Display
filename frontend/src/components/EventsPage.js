import React, { useState, useEffect } from "react";
import axios from "axios";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authToken = query.get("token");
    if (authToken) {
      setToken(authToken);
      fetchEvents(authToken);
    }
  }, []);

  const fetchEvents = async (authToken) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events?token=${authToken}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    filterDate ? event.start.dateTime?.startsWith(filterDate) : true
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!token ? (
        <a href="http://localhost:5000/auth/google">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
            Login with Google
          </button>
        </a>
      ) : (
        <div className="bg-white p-3 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Google Calendar Events
          </h1>
          <div className="w-full flex justify-end">
            <input
              className="block w-36 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="date"
              onChange={(e) => setFilterDate(e.target.value)}
              value={filterDate}
            />
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 text-left">Event Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 border-t border-gray-300">
                    {event.summary}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-300">
                    {new Date(event.start.dateTime || event.start.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-300">
                    {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-300">
                    {event.location || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
