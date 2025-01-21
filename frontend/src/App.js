import React, { useState, useEffect } from "react";
import axios from "axios";
import EventList from "./EventList"; 
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authToken = query.get("token");
    if (authToken) {
      setToken(authToken);
      fetchEvents(authToken);
      toast.success("Logged in successfully", {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
       
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

  const handleLogout = () => {
    setToken(null);
    window.history.replaceState({}, document.title, "/"); // Remove token from URL
    setEvents([]);
    setFilteredEvents([]);
  };

  return (
    <div className="min-h-screen">
      <ToastContainer /> 

      {!token ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 py-4">
          <div className="flex bg-white shadow-xl rounded-xl w-full max-w-5xl overflow-hidden transform transition duration-500 hover:scale-95">
            <div className="w-1/2 flex items-center">
              <img
                src="https://img.freepik.com/free-vector/appointment-booking-with-calendar-illustrated_52683-39126.jpg"
                alt="Login Illustration"
                className="w-full max-w-lg object-cover rounded-tl-xl rounded-bl-xl"
              />
            </div>

            <div className="w-1/2 p-16 flex flex-col justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-tr-xl rounded-br-xl">
              <h1 className="text-4xl font-semibold text-gray-800">Welcome to Your Personalized Calendar</h1>
              <p className="mt-4 text-lg text-gray-600">
                Access your calendar, get reminders, and manage your schedule effortlessly with just one click.
              </p>
              <a
                href="http://localhost:5000/auth/google"
                className="bg-blue-500 text-white px-8 py-4 w-fit rounded-lg hover:bg-blue-600 transition text-center flex items-center justify-center mt-8 transform hover:scale-105 shadow-lg"
              >
                <FcGoogle className="mr-3 text-2xl" /> Login with Google
              </a>
              <div className="mt-10 text-gray-700 text-sm">
                <p>
                  By logging in with Google, you can seamlessly access your personalized calendar events and stay updated with all your event reminders. This ensures a smooth and synchronized experience with your Google account, making it easier to manage your schedule efficiently.
                </p>
              </div>
              <div className="mt-10 flex flex-col items-center text-gray-600">
                <h2 className="text-2xl font-medium">Need Help?</h2>
                <p className="mt-2 text-sm">
                  If you need any assistance or have questions, feel free to contact our support team at
                  <a href="mailto:support@example.com" className="text-blue-500 hover:underline"> support@example.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EventList
          filteredEvents={filteredEvents}
          filterEventsByDate={(date) => {
            if (!date) {
              setFilteredEvents(events);
            } else {
              const filtered = events.filter((event) => {
                const eventDate = new Date(event.start.dateTime || event.start.date);
                return eventDate.toDateString() === date.toDateString();
              });
              setFilteredEvents(filtered);
            }
          }}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
