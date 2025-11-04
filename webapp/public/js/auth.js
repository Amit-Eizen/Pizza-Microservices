// Auth.js - Toggle between Login and Register forms dynamically

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authTitle = document.getElementById('auth-title');
  const toggleText = document.getElementById('auth-toggle-text');

  let isLoginMode = true;

  // Function to toggle between forms
  function toggleForms(e) {
    e.preventDefault();

    if (isLoginMode) {
      // Switch to Register mode
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      authTitle.textContent = 'Sign Up';
      toggleText.innerHTML = 'Already have an account? <a href="#" id="auth-toggle-link">Sign In</a>';
      isLoginMode = false;
    } else {
      // Switch to Login mode
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      authTitle.textContent = 'Sign In';
      toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-toggle-link">Sign Up</a>';
      isLoginMode = true;
    }

    // Re-attach event listener to the new link
    const newToggleLink = document.getElementById('auth-toggle-link');
    newToggleLink.addEventListener('click', toggleForms);
  }

  // Initial event listener
  const toggleLink = document.getElementById('auth-toggle-link');
  toggleLink.addEventListener('click', toggleForms);
});

// Function to toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;

  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}
