# Whitecarrot Intern Project - Google SSO Login and Calendar Event Display

## Overview
This project is a simple web application that demonstrates my backend, frontend, and API integration skills. It allows users to log in via Google Single Sign-On (SSO), fetch their Google Calendar events, and display them in a table with filtering functionality based on event dates.


## Features
**Google SSO Login**
   - Implemented Single Sign-On (SSO) using Google OAuth 2.0 for user authentication.
   - Users can log in securely via their Google account. Once authenticated, the user's Google Calendar events can be accessed.
   - React OAuth Client Library is used to handle the Google login process on the frontend.
   - Backend handles the OAuth token exchange to authenticate the user on the server side.

**Fetching Google Calendar Events**
    - After a successful login, the user's Google Calendar events are fetched via the Google Calendar API.
    - The events are retrieved and displayed in a table on the UI with relevant information such as event name, date,time and location.

**Display Events in a Table Format**
  - Events are displayed in a table, with the most recent event at the top.
  - Each event includes:
      Event title
      Event date
      Event start time and end time
      Event location
  - Tailwind CSS is used for styling the table and other elements to make the design clean and responsive.

**Event Filtering by Date**
    - Added functionality to filter the events based on the date.
    - Users can select date to display only those events that fall on the selected date.
    - The filter is implemented using JavaScript and the React state to update the displayed events dynamically.

## Technologies Used
**Frontend Development (React.js)**
  - **Project Setup**: Created a React application using create-react-app for easy setup and configuration.
  - **Google Login Button**: Integrated the Google login button using the react-oauth/google library.
  - **State Management**: Managed the login state using React’s useState and useEffect hooks.
  - **Event Display**: Displayed events using a dynamic table where each event's data is mapped from the fetched Google Calendar API data.
  - **Event Filtering**: Implemented a date range filter using two date input fields and a button that updates the displayed events.

  **Backend Development (Node.js + Express)**
  - **OAuth 2.0 Authentication**: Set up Google OAuth 2.0 authentication using the google-auth-library for handling user authentication securely.
  - **Google Calendar API Integration**: Used the Google Calendar API to fetch events for the authenticated user. This required setting up OAuth credentials in the Google Cloud console.
  - **API Routes**: Created routes using Express to manage user authentication and fetching events from Google Calendar.
  
  **Google OAuth Integration**
  - Set up OAuth credentials in the Google Developer Console and added the necessary callback URLs for both the frontend and backend.
  - Implemented token handling and the necessary steps to ensure the user is authenticated before fetching calendar events.

  **Styling the UI**
  - Used Tailwind CSS to quickly style the login button, event table, and form controls (date inputs and buttons).
  - Ensured the UI was responsive and mobile-friendly by using Tailwind's responsive utilities.


## Installation

## Prerequisites
- Node.js (v20 or later)

## Setup
1. **Clone the Repository**
   <a href="git clone https://github.com/sathwikavontela/Assignment-Whitecarrot-Intern-2025.git"><a/>
2. **Install Dependencies**
   Navigate to both the frontend and backend directories to install dependencies:
   
   # For the frontend
   cd frontend
   npm install

   # For the backend
   cd backend
   npm install

3. **Configure Environment Variables**:
  Create a .env file in the backend directory with the following contents:
    GOOGLE_CLIENT_ID =  YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET = YOUR_GOOGLE_CLIENT_SECRET
    PORT=5000(i have used it and if you also use the same you need not to change api call's 

4. **Run the Backend (Node.js + Express)**:
   Navigate to the backend directory and run:
      cd backend
      npm run dev

5. **Run the Frontend (React)**:
  Navigate to the frontend directory and run:
      cd frontend
      npm start

6. **Access the Application**:
  Open your browser and navigate to http://localhost:3000 to view the application.

7. **API Endpoints**:
  GET /auth/google
    Description: Initiates the Google OAuth2 authentication process to allow users to log in using their Google account.
    The user will be prompted to grant permission for access to their Google profile and calendar events.
    
  GET /auth/google/callback
    Description: Handles the callback after the user authenticates with Google. On successful authentication, it retrieves
    the access token and redirects to the front-end with the token included in the URL.

  GET /events
    Description: Retrieves Google Calendar events for the authenticated user using the access token passed as a query parameter.
    Request Parameter:
        accessToken (query parameter): The OAuth access token obtained after Google authentication.
    Response: The list of Google Calendar events for the user, or an error message if the token is missing or invalid.


  






