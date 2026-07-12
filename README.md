# DevPulse - Issue Tracking API

A backend REST API for tracking bugs and feature requests, built with Node.js, TypeScript, Express, and PostgreSQL.

## Live URL

https://devpulse-api-tf39.onrender.com

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor and maintainer)
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Reporter details included in issue responses
- Global error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL (Neon)
- bcrypt
- jsonwebtoken
- dotenv
- cors
- http-status-codes

## Installation

```bash
git clone https://github.com/Sumaiya1044/devpulse-api.git
cd devpulse-api
npm install
```

Create a `.env` file:

PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

Run the server:

```bash
npm run dev
```

## Database Schema

### users
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(255) |
| email | VARCHAR(255) UNIQUE |
| password | VARCHAR(255) |
| role | contributor or maintainer |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### issues
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| title | VARCHAR(150) |
| description | TEXT |
| type | bug or feature_request |
| status | open, in_progress, resolved |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |

### Issues
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/issues | Authenticated |
| GET | /api/issues | Public |
| GET | /api/issues/:id | Public |
| PATCH | /api/issues/:id | Authenticated |
| DELETE | /api/issues/:id | Maintainer only |

### Query Parameters
| Param | Values |
|-------|--------|
| sort | newest, oldest |
| type | bug, feature_request |
| status | open, in_progress, resolved |

## GitHub Repository

https://github.com/Sumaiya1044/devpulse-api