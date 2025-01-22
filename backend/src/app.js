// Import required dependencies
const express = require("express"); 
const dotenv = require("dotenv"); 
const cors = require("cors"); 
const passport = require("passport"); // Handles authentication middleware
const session = require("express-session"); // Manages sessions for storing user data
const axios = require("axios"); 
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth2 strategy for Passport

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS configuration to allow requests from localhost:3000 with credentials (cookies)
app.use(cors({ origin: "https://assignment-whitecarrot-intern-2025.vercel.app", credentials: true }));


app.use(express.json()); // Middleware for parsing JSON request bodies


app.use(session({ secret: "secret", resave: false, saveUninitialized: true })); // Middleware to manage sessions with a secret key

// Initialize passport for authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, //  Google OAuth client ID & secret from .env
      callbackURL: 'https://assignment-whitecarrot-intern-2025.onrender.com/auth/google/callback' 
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user profile and access token in session after successful authentication
      return done(null, { profile, accessToken });
    }
  )
);

// Serialize user information into session (store user data in session)
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from session (retrieve user data from session)
passport.deserializeUser((user, done) => done(null, user));

// Initialize passport and session handling middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes

// This Route will initiate the Google OAuth login
app.get(
  "/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar.events.readonly"] 
  })
);

// This is the callback route after Google OAuth authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }), // Redirect to home on failure
  (req, res) => {
    // On success, the accessToken will be redirected to frontend
    res.redirect("https://assignment-whitecarrot-intern-2025.vercel.app?token=" + req.user.accessToken);
  }
);

// Now this route will fetch the events from  Google Calendar events
app.get("/events", async (req, res) => {
  const { accessToken } = req.query; // Extract access token from query params

  // If access token is not provided, responds with an error
  if (!accessToken) {
    return res.status(401).send({ error: "Unauthorized: Access token is missing" });
  }

  try {
    // Make a request to the Google Calendar API to fetch events
    const response = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
       { headers: { Authorization: `Bearer ${accessToken}` } } // Pass the access token as the Authorization header to authorize 
      // the request and access the user's calendar data

    );
    // Send the retrieved events as a response to the frontend
    res.status(200).send(response.data);
  } catch (error) {
    // Handle any errors while fetching events
    console.error("Error fetching events from Google API:", error.response?.data || error.message);
    res.status(500).send({ error: "Internal Server Error", details: error.response?.data || error.message });
  }
});

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 5000; // Default to port 5000 if not provided
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;

// Export the app instance for testing or further use
