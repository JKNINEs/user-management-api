# 🚀 User Management RESTful API

A robust and scalable RESTful API for user management, built with Node.js and Express. This project demonstrates backend best practices including schema validation, automated testing, and interactive API documentation.

## ✨ Features

* **CRUD Operations:** Complete Create, Read, Update, and Delete functionality for user data.
* **Data Validation:** Strict payload validation using Zod to ensure data integrity and prevent bad data from reaching the database.
* **Automated Testing:** 100% Test Coverage for all API endpoints using Jest & Supertest.
* **API Documentation:** Auto-generated and interactive Swagger UI.
* **Database ORM:** Seamless database interactions and migrations using Prisma.
* **Modern JavaScript:** Built using ECMAScript Modules (ESM).

## 🛠️ Tech Stack

* **Node.js** – JavaScript runtime for server-side development
* **Express.js** – Fast, minimalist web framework
* **Prisma** – Next-generation ORM for database management
* **PostgreSQL / MySQL** – Relational database (Configurable via Prisma)
* **Zod** – TypeScript-first schema validation library
* **Jest & Supertest** – Testing framework for unit and integration tests
* **Swagger (OpenAPI)** – API documentation (`swagger-ui-express`, `swagger-jsdoc`)
* **dotenv** – Environment variable management

---

## 🚀 How to Setup this Project (From Scratch)

If you want to recreate this project from the beginning, here are the exact steps we took:

### Step 1: Initialize Project
Initialize the project and enable ES Modules (to use `import/export` syntax).
```bash
npm init -y
```
### Step 2: Enable ESM in package.json (Required)
Prisma v7 is ESM-only. Add the following to your package.json:
```json
 {
   "type": "module"
 }
```

### Step 3: Install Dependencies
Core Packages:
```bash
npm install express dotenv prisma @prisma/client zod swagger-ui-express swagger-jsdoc
```
Development Packages (Testing & Utilities):
```bash
npm install -D jest supertest cross-env nodemon
```

### Step 4: Configure Scripts in package.json
Set up the scripts for running the server and tests. Note: We use --experimental-vm-modules to allow Jest to work with ES Modules.
```json
"scripts": {
  "test": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest",
  "dev": "nodemon src/index.js"
}
```

### Step 5: Initialize Prisma ORM
```bash
npx prisma init
```
This command creates a prisma/schema.prisma file and a .env file. Define your database models in schema.prisma and push the structure to your database:

```bash
npx prisma db push
```

# ⚙️ Running the Project

If you are cloning this repository, follow these steps to run the app:

### 1. Install dependencies:
```bash
npm install
```

### 2. Set up Environment Variables:

Create a `.env` file in the root directory:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

### 3. Sync Database:
```bash
npx prisma db push
```

### 4. Start the server:
```bash
npm run dev    # For development mode
```

# 📖 API Documentation

Once the server is running, you can access the interactive API documentation. We use Swagger UI to make it easy to test endpoints directly from the browser.

👉 Access Swagger UI: http://localhost:3000/api-docs

## 🧪 Testing
This project includes comprehensive unit tests covering all CRUD operations and validation logic.
To run the test suite, simply execute:
```bash
npm run test    # For development mode
```
The test script automatically sets NODE_ENV=test to ensure it does not interfere with the production database (if configured to use a separate test DB).

# 📁 Folder Structure

```text
src/
├── config/         # Database connection configuration (db.js)
├── controllers/    # Route handlers and business logic
├── middleware/     # Custom middlewares (e.g., Zod validation wrapper)
├── routes/         # API route definitions and Swagger JSDoc comments
├── test/           # Unit and integration tests (user.test.js)
├── validation/     # Zod schemas (createUserSchema, updateUserSchema)
└── index.js        # Entry point of the Express application
```