import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./custom-picker.css";

function EventList({ filteredEvents, filterEventsByDate, handleLogout }) {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page for pagination
  const eventsPerPage = 8; // events per page

  // Calculate total number of pages based on the number of events and events per page
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage; // Index of last event on the current page
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage; // Index of first event on the current page
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent); // Get events for the current page

  // Function to go to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); 
    }
  };

  // Function to go to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  };

  // Function to handle logout and show a notification
  const handleLogoutWithNotification = () => {
    toast.success("Logged out successfully"); 
    setTimeout(() => {
      handleLogout(); 
    }, 1000);
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <ToastContainer />
    
      <div className="flex justify-between items-center mb-6">
        <DatePicker
          selected={null} // Set selected date to null initially
          onChange={(date) => filterEventsByDate(date)} // Trigger the filter function when a date is selected and shows the events on the selected date
          className="border border-blue-400 p-3 rounded-lg shadow-lg"
          placeholderText="Filter by date"
        />

        <button
          onClick={handleLogoutWithNotification} // Call logout with notification when clicked
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* Table to display events in a table format*/}
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
            {/* Render events for the current page */}
            {currentEvents.map((event) => {
              const startDateTime = new Date(event.start.dateTime || event.start.date);
              const endDateTime = new Date(event.end.dateTime || event.end.date);

              const date = format(startDateTime, "MMM dd, yyyy"); // Format event start date
              const startTime = startDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const endTime = endDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const time = `${startTime} - ${endTime}`; // Combine start and end time

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

      {/* Pagination controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage} // Trigger previous page function when clicked
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={currentPage === 1} // Disable if on the first page
        >
          <FiArrowLeft />
        </button>
        <span className="px-4 py-2 text-xl">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage} // Trigger next page function when clicked
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={currentPage === totalPages} // Disable if on the last page
        >
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

export default EventList;
