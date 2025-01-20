import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const App = () => {
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      const queryParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = queryParams.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        setToken(tokenFromUrl);
       
        const urlWithoutToken = window.location.href.split('?')[0]; 
        window.history.replaceState({}, '', urlWithoutToken); 
      }
    }
  }, []);
  

  useEffect(() => {
    if (token) {
      fetchEvents(token);
    }
  }, [token]);

  const fetchEvents = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/events?token=${token}`);  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log(data);
      setEvents(data);
    } catch (error) {
      console.log("Error fetching events", error);
    } finally {
      setLoading(false);
    }

  };


  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <div>
         
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan="4">No events found</td></tr>
                ) : (
                  events.map((event, index) => {
                    const startDate = new Date(event.start);
                    const endDate = new Date(event.end);
                    const formattedStartDate = format(startDate, "dd-MM-yyyy");
                    const formattedStartTime = format(startDate, "HH:mm");
                    const formattedEndTime = format(endDate, "HH:mm");

                    return (
                      <tr key={index}>
                        <td>{event.summary}</td>
                        <td>{formattedStartDate}</td>
                        <td>{formattedStartTime} - {formattedEndTime}</td>
                        <td>{event.location}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
