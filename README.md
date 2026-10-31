# Lychat

**Lychat** is a simple real-time chat application built with Vue.js and Node.js. It provides a web-based platform where users can communicate through real-time messaging.

The application uses Socket.IO for real-time communication, MongoDB for data storage, and Redis for messaging infrastructure.

## Features

- **User Authentication** — User registration and login.
- **Real-Time Messaging** — Send and receive messages instantly using Socket.IO.
- **Chat Rooms** — Create and communicate through chat rooms.
- **Friend Management** — Manage friends and connections.
- **Message Management** — Manage chat messages.
- **REST API** — Backend API integration.
- **Database Integration** — MongoDB for persistent data storage.
- **Redis Integration** — Redis Pub/Sub for real-time communication.

## Tech Stack

### Frontend
- Vue.js
- TypeScript
- Vite
- Socket.IO Client
- Bootstrap

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- Redis

### Infrastructure & DevOps
- Docker
- Docker Compose
- Nginx
- Kubernetes
- Helm

## Project Structure

```text
lychat/
├── frontend/                 # Vue.js frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/                  # Node.js backend application
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── infrastructure/           # Infrastructure and deployment configurations
│
├── .env                      # Docker environment configuration
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yaml
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Configuration

Create a `.env` file in the root project directory:

```env
# ==========================================
# BACKEND CONFIGURATION
# ==========================================

NODE_ENV=production
PORT=3004

# MongoDB
MONGO_USER=lychat_admin
MONGO_PASSWORD=your_strong_password

# Redis
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:3002


# ==========================================
# FRONTEND CONFIGURATION
# ==========================================

VITE_API_URL=http://localhost:3004/api
VITE_SOCKET_URL=http://localhost:3004
```

Replace the example credentials and secrets with your own secure values.

**Important:** Never commit your actual `.env` file, database credentials, or JWT secrets to Git.

## Run with Docker Compose

Build and start all application services:

```bash
docker compose up -d --build
```

This command starts:

- Frontend
- Backend
- MongoDB
- Redis

### Check Running Containers

```bash
docker compose ps
```

### View Application Logs

View all service logs:

```bash
docker compose logs -f
```

View backend logs:

```bash
docker compose logs -f backend
```

View frontend logs:

```bash
docker compose logs -f frontend
```

### Stop the Application

```bash
docker compose down
```

To stop the application and remove database volumes:

```bash
docker compose down -v
```

**Warning:** The `-v` option removes the MongoDB and Redis data volumes and may permanently delete stored data.

## Application URLs

Once the containers are running, access the application:

| Service | URL |
|---|---|
| Frontend | http://localhost:3002 |
| Backend API | http://localhost:3004 |
| API Health Check | http://localhost:3004/api/health |

## Docker Services

Docker Compose manages the application and its supporting services.

| Service | Description |
|---|---|
| Frontend | Vue.js application served by Nginx |
| Backend | Node.js and Express.js API |
| MongoDB | Database for application data |
| Redis | In-memory data store and Pub/Sub |

### Docker Volumes

The application uses persistent Docker volumes:

- `mongodb_data` — Stores MongoDB data.
- `redis_data` — Stores Redis data.

These volumes allow data to persist when containers are recreated.

### Docker Network

All application services communicate through a dedicated Docker bridge network:

```text
lychat_network
```

The backend connects to MongoDB and Redis using their Docker Compose service names.

## API Health Check

The backend provides a health-check endpoint:

```http
GET /api/health
```

Test it using:

```bash
curl http://localhost:3004/api/health
```

Example response:

```json
{
  "status": "ok",
  "app": "Lychat API",
  "version": "1.0.3"
}
```

## Environment Variables

Docker Compose automatically reads the root `.env` file and makes the configured variables available to the corresponding services.

### Backend Environment

Backend configuration includes:

- `PORT`
- `MONGO_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

`MONGO_URI` and `REDIS_URL` are constructed by Docker Compose using the credentials in the root `.env` file.

### Frontend Environment

The frontend uses:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

These variables are passed as Docker build arguments and embedded into the frontend bundle during the Vite build process.

**Note:** If you change frontend environment variables, rebuild the frontend image:

```bash
docker compose up -d --build frontend
```

Do not put sensitive credentials or secrets in `VITE_*` variables because frontend environment values are exposed to the browser.

## Infrastructure

The `infrastructure/` directory contains infrastructure and deployment-related configurations maintained separately from the main application setup.

The main application Docker configuration is maintained at the project root.

## Project Purpose

Lychat is a full-stack development project focused on practicing and demonstrating:

- Frontend application development with Vue.js.
- Backend API development with Node.js and Express.js.
- REST API integration.
- Real-time communication using Socket.IO.
- MongoDB database integration.
- Redis Pub/Sub integration.
- Docker containerization.
- Multi-service application management.

## Future Improvements

Potential areas for future development include:

- Improve application security and validation.
- Add message pagination and search.
- Improve error handling and logging.
- Add automated testing.
- Improve application performance.
- Add production deployment and monitoring.
- Implement more advanced chat features.

## License

This project is intended for learning and development purposes. Add an appropriate open-source license if you plan to allow others to reuse or distribute the source code.