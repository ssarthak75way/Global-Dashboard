# Social Task Management System

A full-stack application for managing tasks with social features, built with modern web technologies.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS (via PostCSS/MUI)
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT & Cookies

## Features

- **User Authentication**: Secure signup and login.
- **Task Management**: Create, update, delete, and organize tasks.
- **Social Interactions**: Share tasks, comment on tasks, and collaborate.
- **Responsive Design**: Works on desktop and mobile.

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas URI)

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (if available) or configure your environment variables.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   # Add other required variables
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request