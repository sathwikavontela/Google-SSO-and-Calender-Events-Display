import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom-picker.css";
import { format } from "date-fns";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EventList({ filteredEvents, filterEventsByDate, handleLogout }) {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLogoutWithNotification = () => {
    toast.success("Logged out successfully", {
        onClose: () => handleLogout(), 
      });
    setTimeout(() => {
      handleLogout();
    }, 1000);
  };

  // Use useEffect to check for today's events and filter them for display
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    const today = new Date().toDateString(); // Get today's date in string format (e.g., "Mon Jan 21 2025")

    const eventsForToday = filteredEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      return eventDate.toDateString() === today;
    });

    setTodayEvents(eventsForToday);
  }, [filteredEvents]);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
      <DatePicker
        selected={null}
        onChange={(date) => filterEventsByDate(date)}
        className="border border-blue-400 p-3 rounded-lg shadow-lg"
        placeholderText="Filter by date"
        isClearable
        clearButtonClassName="text-red-500 hover:text-red-700"
        />

        <button
          onClick={handleLogoutWithNotification} // Trigger logout and notification
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>

      {todayEvents.length > 0 && (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Today's Events</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {todayEvents.map((event) => {
        const startDateTime = new Date(event.start.dateTime || event.start.date);
        const endDateTime = new Date(event.end.dateTime || event.end.date);

        const date = format(startDateTime, "MMM dd, yyyy");
        const startTime = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const time = `${startTime} - ${endTime}`;

        return (
          <div
            key={event.id}
            className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 p-6 rounded-xl shadow-xl hover:scale-105 hover:rotate-1 hover:shadow-2xl transition-transform duration-300 border-2 border-transparent hover:border-blue-600"
          >
            <h3 className="font-extrabold text-white text-xl mb-2">{event.summary}</h3>
            <p className="text-md text-white">{date}</p>
            <p className="text-md text-white">{time}</p>
            <div className="flex items-center mt-2 text-sm text-white">
              {event.location && (
                <svg
                  className="w-5 h-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 2C8.13 2 5 5.13 5 9c0 3.75 4.25 8.25 7 11 2.75-2.75 7-7.25 7-11 0-3.87-3.13-7-7-7zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                  />
                </svg>
              )}
              <span>{event.location || "No location provided"}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}



      <div className="overflow-x-auto rounded-lg shadow-xl bg-white">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 border-b text-left">Event</th>
              <th className="px-6 py-3 border-b text-left">Date</th>
              <th className="px-6 py-3 border-b text-left">Time</th>
              <th className="px-6 py-3 border-b text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => {
              const startDateTime = new Date(event.start.dateTime || event.start.date);
              const endDateTime = new Date(event.end.dateTime || event.end.date);

              const date = format(startDateTime, "MMM dd, yyyy");
              const startTime = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const time = `${startTime} - ${endTime}`;

              return (
                <tr key={event.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 border-b">{event.summary}</td>
                  <td className="px-6 py-4 border-b">{date}</td>
                  <td className="px-6 py-4 border-b">{time}</td>
                  <td className="px-6 py-4 border-b">{event.location || "No location provided"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <FiArrowLeft /> {/* React Icon for Left Arrow */}
        </button>
        <span className="px-4 py-2 text-xl">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <FiArrowRight /> {/* React Icon for Right Arrow */}
        </button>
      </div>
    </div>
  );
}

export default EventList;
