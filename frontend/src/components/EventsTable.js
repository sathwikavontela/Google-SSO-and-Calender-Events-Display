import React from "react";

const EventsTable = ({ filteredEvents }) => (
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
        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="px-4 py-2 border-t border-gray-300">{event.summary}</td>
          <td className="px-4 py-2 border-t border-gray-300">
            {new Date(event.start.dateTime || event.start.date).toLocaleDateString()}
          </td>
          <td className="px-4 py-2 border-t border-gray-300">
            {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>
          <td className="px-4 py-2 border-t border-gray-300">{event.location || "N/A"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default EventsTable;
