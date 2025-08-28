/**
 * @file authService.js
 * @description This file provides a service for handling authentication by
 * making API calls to the Flask backend.
 */

const authService = {
  /**
   * Caches the current user's data to avoid repeated API calls.
   */
  _currentUser: null,
  _isAuthenticated: false,
  _authCheckPromise: null,

  /**
   * Sends a login request to the backend.
   * @param {string} username The username.
   * @param {string} password The password.
   * @returns {Promise<object>} The server's response.
   */
  login: async function(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  /**
   * Sends a logout request to the backend.
   */
  logout: async function() {
    await fetch('/api/logout', { method: 'POST' });
    this._currentUser = null;
    this._isAuthenticated = false;
    // Redirect to login page after logout
    window.location.href = '/login';
  },

  /**
   * Checks with the backend if the user is currently authenticated.
   * Caches the result to avoid re-fetching on the same page load.
   * @returns {Promise<boolean>} True if authenticated, otherwise false.
   */
  isAuthenticated: async function() {
    if (this._authCheckPromise) {
      return this._authCheckPromise;
    }
    this._authCheckPromise = this._checkAuth();
    return this._authCheckPromise;
  },

  /**
   * Internal function to perform the auth check.
   */
  _checkAuth: async function() {
    try {
      const response = await fetch('/api/check_auth');
      const data = await response.json();
      this._isAuthenticated = data.isAuthenticated;
      this._currentUser = data.user || null;
      return this._isAuthenticated;
    } catch (error) {
      console.error('Authentication check failed:', error);
      this._isAuthenticated = false;
      this._currentUser = null;
      return false;
    }
  },

  /**
   * Gets the current authenticated user's data.
   * @returns {object|null} The user object or null if not authenticated.
   */
  getCurrentUser: function() {
    return this._currentUser;
  }
};

// Perform an initial authentication check when the script loads.
// This will populate the authService with user data if a valid session exists.
document.addEventListener('DOMContentLoaded', () => {
    authService.isAuthenticated();
});
