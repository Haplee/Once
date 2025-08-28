/**
 * @file login.js
 * @description Handles the login form submission and user authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessageDiv = document.getElementById('error-message');

  // If already authenticated, the backend will redirect from /login to /
  // so a client-side check is not strictly necessary but can prevent a flash of the login page.
  authService.isAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = loginForm.username.value;
      const password = loginForm.password.value;

      errorMessageDiv.style.display = 'none';
      errorMessageDiv.textContent = '';

      try {
        const result = await authService.login(username, password);

        if (result.status === 'success') {
          // Redirect to the dashboard on successful login
          window.location.href = '/';
        } else {
          errorMessageDiv.textContent = result.message || 'Usuario o contraseña incorrectos.';
          errorMessageDiv.style.display = 'block';
        }
      } catch (error) {
        console.error('Login failed:', error);
        errorMessageDiv.textContent = 'An error occurred while trying to log in.';
        errorMessageDiv.style.display = 'block';
      }
    });
  }
});
