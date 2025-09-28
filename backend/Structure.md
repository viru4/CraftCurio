# Backend Folder Structure Documentation for CraftCurio

This document explains the purpose of each folder and key file in the backend of the CraftCurio project.

---

## Folder and File Explanations

### `models/`

- **Purpose:** Contains all data schemas that define how data is structured, stored, and validated in the database.

- **Contents:** Mongoose schemas or ORM model files such as:
  - `User.js` — Defines user details and roles (artisan, collector, admin).
  - `Artisan.js` — Profile and details related to artisans.
  - `ArtisanProduct.js` — Schema for artisan handmade products.
  - `Collectible.js` — Schema for collectible items like antiques, trading cards.
  - `Order.js` — Order placement, status, and tracking information.
  - `Message.js` — Schema for user messaging and chat.
  - `Verification.js` — Documents and statuses for authenticity checks.
  - `Event.js` — Details of live auctions and community events.

### `controllers/`

- **Purpose:** Contains the business logic handling incoming API requests, processing data via models, and sending responses.

- **Contents:** Functions and modules managing core backend features:
  - User authentication and profile management
  - Product and collectible CRUD (Create, Read, Update, Delete) operations
  - Order and payment processing
  - Messaging and chat handling
  - Verification workflows
  - Event management

### `routes/`

- **Purpose:** Defines the API endpoints exposed by the server and connects routes to controller functions.

- **Contents:** Express router files grouped by feature/domain:
  - `auth.js` — Login, registration, token refresh
  - `artisans.js` — Artisan profile and product routes
  - `products.js` — Artisan product-related routes
  - `collectibles.js` — Collectible-specific endpoints
  - `orders.js` — Customer orders and tracking routes
  - Others as needed (messages, events)

### `middleware/`

- **Purpose:** Provides reusable logic executed during the request/response cycle before the final controller methods.

- **Contents:** Code for:
  - Authentication and authorization checks
  - Request validation
  - Error handling and logging
  - Rate limiting or security headers

### `utils/`

- **Purpose:** Contains utility/helper functions used across multiple parts of the backend.

- **Contents:** Helper modules for tasks such as:
  - Input validation
  - Date/time formatting
  - Generating unique IDs or tokens
  - Response formatting

### `server.js`

- **Purpose:** The entry point of the backend application.

- **Contents:** Code to:
  - Initialize the Express app
  - Connect to the database
  - Configure middleware and routes
  - Launch the server listening on a defined port

### `.env`

- **Purpose:** Stores environment-specific variables securely outside the codebase.

- **Contents:** Variables such as:
  - Database connection URI
  - Server port number
  - API keys or third-party service credentials
  - JWT secret keys

### `package.json`

- **Purpose:** Manages dependencies, scripts, and metadata of the backend Node.js project.

- **Contents:** Lists:
  - Node.js packages used (e.g., Express, Mongoose)
  - Scripts for starting, testing, or building the app
  - Metadata like project name, version, author

---

## Summary

This thoughtfully organized folder structure helps maintain clean, readable, and scalable code. By separating concerns into models, controllers, routes, and utilities, development and maintenance become manageable even as CraftCurio’s backend grows in features and complexity.
