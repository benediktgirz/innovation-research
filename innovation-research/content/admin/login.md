---
layout: base.vto
title: Admin Login
description: Secure login for research data administration
lang: en
---

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Access research data administration
      </p>
    </div>
    <form class="mt-8 space-y-6" id="login-form">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Email address"
          >
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Password"
          >
        </div>
      </div>

      <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          id="login-button"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-primary-light group-hover:text-primary-lighter" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const loginButton = document.getElementById('login-button');

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  function hideError() {
    errorMessage.classList.add('hidden');
  }

  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'saltBG2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Disable button during login
    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';

    try {
      // Client-side authentication for static hosting
      const validEmail = 'bg@benedikt-girz.com';
      const validPasswordHash = '77291d7e4a46974e3d4baf878b1e6dd4c74dbe164815a8b222d6c60c198dcbd3';

      // Hash the provided password with the same salt used server-side
      const passwordHash = await hashPassword(password);

      if (email === validEmail && passwordHash === validPasswordHash) {
        // Generate a simple session token
        const sessionToken = btoa(`${email}:${Date.now()}:${Math.random()}`);
        localStorage.setItem('adminToken', sessionToken);
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('loginTime', Date.now().toString());

        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard/';
      } else {
        showError('Invalid email or password');
      }
    } catch (error) {
      showError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      // Re-enable button
      loginButton.disabled = false;
      loginButton.textContent = 'Sign in';
    }
  });
});
</script>