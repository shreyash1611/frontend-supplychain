// Simple auth utility functions

// Check if user is logged in
export const isLoggedIn = () => {
  return localStorage.getItem('userId') !== null;
};

// Log out user
export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  window.location.href = '/';
};

// Get current user ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};

// Get user name
export const getUserName = () => {
  return localStorage.getItem('userName') || 'User';
}; 