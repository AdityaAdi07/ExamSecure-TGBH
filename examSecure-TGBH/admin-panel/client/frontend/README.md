# ExamSecure Proctoring Admin Panel

A MERN stack application to monitor and manage users during online exams.

## Features

- View active users with risk scores
- Monitor keyboard and mouse risk factors
- Real-time alerts for suspicious activities
- Take actions: ban/unban users, send warnings
- Risk score distribution visualization

## Project Structure

```
examsecure-admin/
├── client/                      # React frontend
│   ├── public/                  # Static files
│   ├── src/                     # React components
│   └── package.json             # Frontend dependencies
├── server/                      # Express backend
│   ├── config/                  # Database configuration
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── controllers/             # Business logic
│   ├── server.js                # Entry point
│   └── package.json             # Backend dependencies
└── README.md                    # This file
```

## Installation

### Prerequisites

- Node.js
- MongoDB URI (to be provided)

### Setting Up the Backend

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with your MongoDB URI:
   ```
   MONGO_URI=your_mongodb_uri_here
   PORT=5000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Setting Up the Frontend

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React app:
   ```
   npm start
   ```

## Usage

1. Open your browser and go to http://localhost:3000
2. Use the search bar to find specific users
3. Select a user to perform actions (ban, unban, send warning)
4. The dashboard will show real-time alerts and risk distribution

## API Endpoints

- `GET /api/users` - Get all users with their risk data
- `GET /api/users/:id` - Get a specific user with risk data
- `POST /api/users/ban` - Ban a user
- `POST /api/users/unban` - Unban a user
- `POST /api/users/warn` - Send a warning to a user
- `GET /api/users/search/:query` - Search for users

## Database Structure

The application uses two main collections in MongoDB:

1. **users** - Stores user information
   - `_id`: MongoDB ObjectId
   - `name`: User's name
   - `email`: User's email

2. **risklogs** - Stores risk information for each user
   - `_id`: MongoDB ObjectId
   - `userId`: Reference to the user
   - `appRisk`: Risk score from applications
   - `finalRisk`: Overall risk score
   - `keyboardRisk`: Risk score from keyboard activities
   - `mouseRisk`: Risk score from mouse movements
   - `appsOpened`: Array of applications opened
   - `updatedAt`: Timestamp of the last update
   - `status`: Current user status

## Status Logic

The application determines user status based on risk scores:
- `Normal`: Risk score < 50
- `Warning`: Risk score 50-80
- `OS Lockdown`: Risk score 80-90
- `Ban`: Risk score > 90