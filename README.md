# Trello Clone

A full-stack project building a Trello clone using the MERN stack (MongoDB, Express, React, Node.js).
This is a comprehensive guide and implementation of a task management application.

## Project Structure

- **`/client`**: The React frontend application (initialized with Vite).
- **`/server`**: The Node.js/Express backend API.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Setup Server:**
    ```bash
    cd server
    npm install
    cp .env.example .env # (If you have an example file)
    npm run dev
    ```

2.  **Setup Client:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Scripts

- `npm run format`: Runs Prettier to format code (available in both client and server directories).
