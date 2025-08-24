/**
 * @file authService.js
 * @description This file provides a service for handling authentication.
 * It is designed to be easily adaptable for a future backend implementation.
 *
 * IMPORTANT: This implementation is for demonstration purposes only and is NOT secure.
 * It fetches a publicly accessible JSON file, which exposes all usernames and passwords.
 * In a production environment, this should be replaced with a secure backend authentication system.
 */

const authService = {
  /**
   * Authenticates a user by checking credentials against the data from users.json.
   *
   * @param {string} username The username entered by the user.
   * @param {string} password The password entered by the user.
   * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, otherwise false.
   */
  login: async function(username, password) {
    try {
      // The path is relative to the HTML file that includes this script (login.html)
      const response = await fetch('users.json');
      if (!response.ok) {
        console.error('Failed to load user data. Network response was not ok.');
        return false;
      }
      const userData = await response.json();
      const users = userData.users;

      // Find a user that matches the provided username and password
      // In a real application, passwords would be hashed and salted.
      const foundUser = users.find(user => user.username === username && user.password === password);

      return !!foundUser; // Returns true if a user was found, false otherwise
    } catch (error) {
      console.error('An error occurred during the login process:', error);
      return false;
    }
  },

  /**
   * Logs the user out by clearing the session storage.
   */
  logout: function() {
    sessionStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
  },

  /**
   * Checks if the user is authenticated.
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  isAuthenticated: function() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }
};
