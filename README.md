# Nest.js REST API for User Authentication and Post Management

## Description

This project is a REST API built with Nest.js, designed to handle user authentication, session management, and post management. The API provides secure user registration, authentication, and CRUD operations for users and their posts.

## Features

### Stage 1: User Management

✔️ User authentication with email and password (login/logout).
✔️ Session management (start/end user session).
✔️ Viewing a list of users (only for authenticated users).
✔️ Searching users by ID or email (only for authenticated users).
✔️ Filtering users by existing fields.
✔️ User registration.
✔️ Updating user data (only by the owner).
✔️ Deleting a user account (only by the owner).

### Stage 2: Post Management

✔️ Viewing posts (available for all users).
✔️ Creating posts (only for authenticated users).
✔️ Editing posts (only by the owner).
✔️ Deleting posts (only by the owner).

## Technologies Used

- Nest.js – Framework for building scalable server-side applications.

- TypeScript – Strictly typed JavaScript for better code maintainability.

- PostgreSQL – Relational database for storing user and post data.

- TypeORM – ORM for managing database operations.

- JWT (JSON Web Token) – Secure user authentication.

- Redis – In-memory data structure store used as a cache and message broker for improving application performance and handling real-time data.

- ESLint & Prettier – Code quality and formatting tools.


## Installation & Setup

### 1. Clone the Repository

https://github.com/Anna-Kashyra/backend-exam.git

### 2. Install Dependencies

```bash
$ npm install
```

### 3. Configure Environment Variables
Create a .env file based on .env.example and set up your configuration.

## Compile and run the project

```bash
# Development Mode
$ npm run start:dev

# Production Mode
$ npm run build
$ npm run start
```

## API Endpoints

All API endpoints are documented using Swagger. You can explore all available endpoints and test requests directly in the browser by accessing /api/docs after starting the application.

## Database migrations

This project uses a migration system to manage the database schema.

### Automatic application of migrations

Migrations are applied automatically when the server starts thanks to the parameter `migrationsRun: true`  in `src/database/database.service.ts`.

### Manually managing migrations

If you need to apply or roll back migrations manually, use the following commands:

```bash
# Generation of new migration:
$ npm run typeorm migration:generate

# Running migrations:
$ npm run typeorm migration:run

# Revert of the last migration:
$ npm run typeorm migration:revert
```
