// Facebook App Configuration
const APP_ID = '1386670096483873';
const REQUIRED_PERMISSIONS = 'public_profile,email,user_birthday,user_age_range';

// DOM elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const helperText = document.getElementById('helper-text');
const statusMessage = document.getElementById('status-message');
const themeToggle = document.getElementById('theme-toggle');

// Theme Management
function initTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle state: ON = dark mode, OFF = light mode
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-checked', isDark.toString());
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme on page load
initTheme();

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Suppress non-critical Facebook SDK analytics errors
// These occur when ad blockers block Facebook's analytics requests
// The SDK still works correctly, these are just telemetry failures
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && typeof event.reason === 'object') {
    const message = event.reason.message || '';
    // Suppress Facebook SDK analytics/telemetry errors
    if (message.includes('Failed to fetch') || 
        message.includes('ERR_BLOCKED_BY_CLIENT') ||
        event.reason.name === 'TypeError') {
      event.preventDefault(); // Prevent console error
      return;
    }
  }
});

// HTTPS check (required for Facebook SDK in browsers)
if (window.location.protocol !== 'https:') {
  alert('This app must be opened using the HTTPS ngrok URL.');
}

// fbAsyncInit MUST be defined globally so the SDK can call it
window.fbAsyncInit = function () {
  FB.init({
    appId: APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v19.0'
  });

  // Check login status on load
  FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
      // Check if we have the required permissions
      FB.api('/me/permissions', function(permissionsResponse) {
        const permissions = permissionsResponse.data || [];
        const hasBirthday = permissions.some(p => p.permission === 'user_birthday' && p.status === 'granted');
        const hasAgeRange = permissions.some(p => p.permission === 'user_age_range' && p.status === 'granted');
        
        if (!hasBirthday || !hasAgeRange) {
          console.warn('Missing permissions. User needs to re-login to grant birthday/age_range permissions.');
          console.log('Current permissions:', permissions);
        }
      });
      
      fetchUserInfo();
    } else {
      // Make sure login button is visible initially
      userInfo.style.display = 'none';
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      // Helper text visible only in logged-out state
      if (helperText) {
        helperText.style.opacity = '1';
        helperText.style.display = 'block';
      }
    }
  });
};

