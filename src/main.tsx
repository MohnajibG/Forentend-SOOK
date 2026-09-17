import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "../src/App";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
