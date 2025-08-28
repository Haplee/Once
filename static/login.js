/**
 * @file login.js
 * @description Maneja el envío del formulario de login y la autenticación del usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessageDiv = document.getElementById('error-message');

  if (authService.isAuthenticated()) {
    window.location.href = 'index.html';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = loginForm.username.value;
      const password = loginForm.password.value;

      errorMessageDiv.style.display = 'none';
      errorMessageDiv.textContent = '';

      try {
        const isAuthenticated = await authService.login(username, password);

        if (isAuthenticated) {
          window.location.href = 'index.html';
        } else {
          errorMessageDiv.textContent = 'Usuario o contraseña incorrectos.';
          errorMessageDiv.style.display = 'block';
        }
      } catch (error) {
        console.error('Fallo en el login:', error);
        errorMessageDiv.textContent = 'Ocurrió un error al intentar iniciar sesión.';
        errorMessageDiv.style.display = 'block';
      }
    });
  }
});
