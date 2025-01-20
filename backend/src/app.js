const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { google } = require("googleapis");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.options("*", cors()); 

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ],
  })
);


app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`http://localhost:3000/?token=${req.user.accessToken}`);
  }
);

app.get("/events", async (req, res) => {

  const { token } = req.query;
  
  if (!token) {
    // console.error("Error: Missing token");
    return res.status(400).json({ error: "Token missing" });
  }

  //console.log(token);
  const calendar = google.calendar({
    version: "v3", 
    auth: token
  });

  //console.log(calendar);

  try {
    const events = await calendar.events.list({
      calendarId: "primary",
      orderBy: "startTime",
      singleEvents: true,
    });

    console.log(events);

    const eventDetails = events.data.items
      .map((event) => ({
        summary: event.summary || "No title",
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        location: event.location || "No location",
      }))
      .sort((a, b) => new Date(b.start) - new Date(a.start));

    res.status(200).json(eventDetails);
  } catch (error) {
    //console.error("Error fetching events from Google Calendar API:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
