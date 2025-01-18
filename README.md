# Snappfood.ir Backend clone. With Nest.js

This project is a simple backend clone of [Snappfood.ir](https://snappfood.ir) that implements some features like user management and supplier signup and managing menu items and menu types of a supplier and also order and payment gateway for user to order foods they want. all of them implemented using **Nest.js** and **MySql**.

---

## Table of Contents

- [Snappfood.ir Backend clone. With Nest.js](#snappfoodir-backend-clone-with-nestjs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Running the Project](#running-the-project)
    - [Using Docker](#using-docker)
    - [Without Docker](#without-docker)
  - [API Documentation](#api-documentation)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

---

## Features

- **Authentication and Authorization**: Secure login and role-based access control.
- **Payment Gateway**: using Zarinpal.
- **Supplier singup**: managing suppliers and let them have their own menu
- **User orders management**: users can have their own order list in basket and finalized on payment step.
- **Database Migrations**: Smooth database management using TypeORM.
- **Dockerized Environment**: Easy setup with Docker and Docker Compose.
- **Environment Configuration**: Configurable using `.env` files.
- **Modular Architecture**: Organized and scalable code structure.

---

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and reliable server-side applications.
- **TypeScript**: For static typing and enhanced code quality.
- **TypeORM**: For object-relational mapping and database migrations.
- **MySQL**: As the primary database.
- **Docker**: To containerize the application.
- **JWT**: For secure authentication.

---

## Project Structure

```plaintext
src/
├── common/          # Shared utilities and middlewares
├── config/          # Application configuration
├── migrations/      # Database migration files
├── modules/         # Feature-specific modules
├── main.ts          # Application entry point
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/)
- [MySQL](https://www.mysql.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/erfunit/snappfood.ir-backend-clone-nestjs
   cd snappfood.ir-backend-clone-nestjs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Copy the `.env.example` file and update the values as needed:

   ```bash
   cp .env.example .env
   ```

---

## Running the Project

### Using Docker

1. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:<port>`.

### Without Docker

1. Start the PostgreSQL database and configure `.env` with its credentials.

2. Run the application:

   ```bash
   npm run start:dev
   ```

---

## API Documentation

API documentation is automatically generated with **Swagger** and available at:

```
http://localhost:<port>/swagger
```

---

## Scripts

- **Development**: `npm run start:dev`
- **Build**: `npm run build`
- **Run Migrations**: `npm run migration:run`
- **Revert Migrations**: `npm run migration:revert`
- **Lint**: `npm run lint`

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

Special thanks to the creators of NestJS, TypeORM, and other libraries used in this project.
