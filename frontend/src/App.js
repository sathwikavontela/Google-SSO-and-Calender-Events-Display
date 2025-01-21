import React, { useState, useEffect } from "react"; 
import axios from "axios";
import EventList from "./EventList";
import { FcGoogle } from "react-icons/fc"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  const [token, setToken] = useState(null); // State to store the user's authentication token
  const [events, setEvents] = useState([]); //State to store all the events
  const [filteredEvents, setFilteredEvents] = useState([]); // State to store the filtered events based on date

  useEffect(() => {
    // Checking if there's a token in the URL query params when the component mounts
    const query = new URLSearchParams(window.location.search);
    const authToken = query.get("token"); // Get the token from the URL
    if (authToken) {
      setToken(authToken); // set the token if it's found
      fetchEvents(authToken); // Fetch the events using the access token
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
  }, []); // Empty dependency array ensures this only runs once when the component mounts  i.e, when a component is added to the DOM for the first time

  const fetchEvents = async (accessToken) => {
    try {
      
      const res = await axios.get(`http://localhost:5000/events?accessToken=${accessToken}`);// Making an API request to get events using the access token
      const events = res.data.items || []; // Getting events from the response data
      setEvents(events); // Storing events in the state
      setFilteredEvents(events); // Initially showing all events
    } catch (err) {
      console.error(err); // Log any errors that occur during the request
    }
  };

  const handleLogout = () => {
    setToken(null);
    window.history.replaceState({}, document.title, "/"); // Remove token from URL
    setEvents([]); // Clear the events
    setFilteredEvents([]); // Clear the filtered events
  };

  return (
    <div className="min-h-screen">
      <ToastContainer /> {/* Container for toast notifications */}

      {!token ? (
        // If the user is not logged in, show the login screen
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
            </div>
          </div>
        </div>
      ) : (
        // If the user is logged in, show the event list
        <EventList
          filteredEvents={filteredEvents} // Passing filtered events to the EventList component
          filterEventsByDate={(date) => {
            // Function to filter events by date
            if (!date) {
              setFilteredEvents(events); // If no date is selected, show all events
            } else {
              const filtered = events.filter((event) => {
                const eventDate = new Date(event.start.dateTime || event.start.date);
                return eventDate.toDateString() === date.toDateString(); // Filter events by the selected date
              });
              setFilteredEvents(filtered); // Update the filtered events state
            }
          }}
          handleLogout={handleLogout} // Passing logout function to EventList component
        />
      )}
    </div>
  );
}

export default App; 
