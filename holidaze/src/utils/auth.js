// src/utils/auth.js

// Save user data and token to localStorage
export function saveAuth(userData) {
  localStorage.setItem("token", userData.accessToken);
  localStorage.setItem("user", JSON.stringify(userData));
}

// Get the saved token
export function getToken() {
  return localStorage.getItem("token");
}

// Get the saved user object
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Clear login data (on logout)
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
