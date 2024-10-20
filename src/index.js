import React from 'react';
import ReactDOM from 'react-dom/client';  // Change this import
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot here
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
  