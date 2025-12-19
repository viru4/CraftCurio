# CraftCurio Project Structure Guide

This document provides a detailed breakdown of the folder structure and key files in the `src` directories for both the Frontend and Backend of the CraftCurio application.

## 🔙 Backend (`backend/src`)

The backend handles server-side logic, API endpoints, database interactions, and external services.

### Core Directories

- **`api/`**: The heart of the application's API.
  - **`controllers/`**: Contains the business logic for each API endpoint. Functions here run when a specific route is hit (e.g., `authController.js` handles login/signup).
  - **`routes/`**: Defines URL endpoints (e.g., `/api/users`) and maps them to their respective controllers.

- **`config/`**: Configuration files for the app and external services.
  - Includes database setup (`db.js`), Cloudinary, Stripe, and environment configurations.

- **`middleware/`**: Functions that execute *before* controller logic.
  - **Auth**: Verifying tokens/sessions (`authMiddleware`).
  - **Uploads**: Handling file processing (`multer`).
  - **Validation**: Checking request data integrity.
  - **Error Handling**: Global error management.

- **`models/`**: Mongoose Schemas defining the data structure for MongoDB (e.g., `User.js`, `Product.js`).

- **`services/`**: Encapsulated business logic separated from controllers for reusability.
  - `emailService.js`: Handling transactional emails.
  - `paymentService.js`: Payment processing logic.
  - `uploadService.js`: Cloud storage interactions.

- **`sockets/`**: Real-time communication logic (Socket.io).
  - Handles live chat, notifications, and auction updates.

- **`utils/`**: Shared helper functions.
  - `token.js`: JWT generation and verification.
  - `validator.js`: Data validation helpers.

### Key Files

- **`app.js`**: The main entry point. Initializes Express, sets up middleware (CORS, Helmet), connects to the database, and mounts routes.

---

## 🎨 Frontend (`front-end/src`)

The frontend is the React application that users interact with.

### Core Directories

- **`assets/`**: Static resources like images, logos, fonts, and global icons.

- **`components/`**: Reusable UI elements.
  - **`ui/`**: Atomic components (Buttons, Inputs, Cards), often generic or from a library.
  - **`layout/`**: Structural components (Header, Footer, Sidebar).
  - **`[feature]/`**: Feature-specific components (e.g., `auth/`, `product/`).

- **`contexts/`**: React Context providers for global state management.
  - `AuthContext`: User authentication state.
  - `CartContext`: Shopping cart management.

- **`data/`**: Static constants, mock data, and navigation configurations.

- **`forms/`**: Form-related logic, including validation schemas (Zod) and form wrappers.

- **`hooks/`**: Custom React hooks for reusable logic.
  - `useAuth`, `useFetch`, `useWindowSize`.

- **`lib/`**: Library configurations and utilities.
  - `utils.js`: Class name merging (`cn`) and other low-level helpers.
  - `currency.js`: Currency formatting utilities.

- **`pages/`**: Top-level route components representing full screens.
  - `Home.jsx`, `Login.jsx`, `Dashboard.jsx`.

- **`routes/`**: Routing configuration (React Router), defining which page loads for which URL.

- **`utils/`**: General frontend utility functions (date formatting, string helpers).

### Key Files

- **`App.jsx`**: The root component. Sets up providers and the main router.
- **`main.jsx`**: The entry point mounting the React app to the DOM.
- **`index.css`**: Global styles and Tailwind CSS directives.
