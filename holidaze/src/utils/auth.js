
// Save user data and token to localStorage
export function saveAuth(userData) {
  if (userData.accessToken) {
    localStorage.setItem("token", userData.accessToken);
  } else {
    console.warn("Warning: accessToken is undefined. Token not saved to localStorage.");
  }
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
