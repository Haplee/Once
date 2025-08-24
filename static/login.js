/**
 * @file login.js
 * @description Handles the login form submission and user authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessageDiv = document.getElementById('error-message');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = loginForm.username.value;
      const password = loginForm.password.value;

      // Hide previous error messages
      errorMessageDiv.style.display = 'none';
      errorMessageDiv.textContent = '';

      try {
        const isAuthenticated = await authService.login(username, password);

        if (isAuthenticated) {
          // Store a flag in sessionStorage to indicate the user is logged in
          sessionStorage.setItem('isAuthenticated', 'true');
          // Redirect to the main application page
          window.location.href = 'index.html';
        } else {
          // Show an error message
          errorMessageDiv.textContent = 'Usuario o contraseña incorrectos.';
          errorMessageDiv.style.display = 'block';
        }
      } catch (error) {
        console.error('Login failed:', error);
        errorMessageDiv.textContent = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo.';
        errorMessageDiv.style.display = 'block';
      }
    });
  }
});
