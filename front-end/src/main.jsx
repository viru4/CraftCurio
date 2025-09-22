import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { isValidPublishableKey } from '@/lib/utils'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerk = isValidPublishableKey(PUBLISHABLE_KEY);

const AppTree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {hasClerk ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{AppTree}</ClerkProvider>
    ) : (
      AppTree
    )}
  </React.StrictMode>
);
