// src/utils/auth.js

export const saveAuth = ({ accessToken, name, email, avatar, banner }) => {
    if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      if (name && email) {
        localStorage.setItem(
          'user',
          JSON.stringify({ name, email, avatar, banner })
        );
      }
  };
  
  export const getToken = () => localStorage.getItem('token');
  
  export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  