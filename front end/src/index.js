import React from 'react';
import ReactDOM from 'react-dom/client'; // Update this import
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the provider

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your Google OAuth client ID

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root')); // Create root

// Render the application inside the GoogleOAuthProvider
root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);