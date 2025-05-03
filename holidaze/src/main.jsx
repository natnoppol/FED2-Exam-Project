
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <App />
    </div>
  </React.StrictMode>
);
