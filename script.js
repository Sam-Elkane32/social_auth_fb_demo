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

// Login with re-authentication to force account selection dialog
// This ensures Facebook shows "Continue as [Name]" and "Cancel" options
// even if user is already logged into Facebook, allowing account switching
loginBtn.addEventListener('click', function () {
  const btnText = loginBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;
  
  // Show loading state
  loginBtn.disabled = true;
  btnText.textContent = 'Connecting...';
  
  try {
    FB.login(function (response) {
      // Reset button state
      loginBtn.disabled = false;
      btnText.textContent = originalText;
      
      if (response.authResponse) {
        // Check what permissions were granted
        console.log('Login response:', response);
        console.log('Granted permissions:', response.authResponse.grantedScopes);
        
        // Login successful - fetch and display user info
        fetchUserInfo();
      } else {
        // User cancelled login or closed the dialog
        // UI remains on login screen, user can try again with different account
        console.log('User cancelled login or permissions were denied');
      }
    }, { 
      scope: REQUIRED_PERMISSIONS,
      auth_type: 'reauthenticate', // Force Facebook to show account selection dialog
      return_scopes: true // Return granted scopes in response
    });
  } catch (error) {
    // Reset button state on error
    loginBtn.disabled = false;
    btnText.textContent = originalText;
    // Silently handle any SDK initialization errors
    console.warn('Login attempt failed:', error);
  }
});

// Logout - clears app session and resets UI
// Note: This only logs out from the app, not from Facebook globally
// User can log in again and will see account selection dialog due to reauthenticate
logoutBtn.addEventListener('click', function () {
  try {
    FB.logout(function (response) {
      // Clear user data from UI
      document.getElementById('user-name').textContent = '';
      document.getElementById('user-email').textContent = '';
      document.getElementById('profile-picture').src = '';
      document.getElementById('user-birthday').textContent = 'Birthday not available';
      document.getElementById('user-age-range').textContent = 'Age range not available';
      
      // Reset UI to login state
      userInfo.style.display = 'none';
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      // Show helper text again when logged out
      if (helperText) {
        helperText.style.display = 'block';
        helperText.style.opacity = '1';
      }
    });
  } catch (error) {
    // Silently handle any SDK errors during logout
    console.warn('Logout error:', error);
    // Still reset UI even if SDK call fails
    document.getElementById('user-name').textContent = '';
    document.getElementById('user-email').textContent = '';
    document.getElementById('profile-picture').src = '';
    document.getElementById('user-birthday').textContent = 'Birthday not available';
    document.getElementById('user-age-range').textContent = 'Age range not available';
    userInfo.style.display = 'none';
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    if (helperText) {
      helperText.style.display = 'block';
      helperText.style.opacity = '1';
    }
  }
});

// Format birthday from Facebook format (MM/DD/YYYY or MM/DD) to readable format
function formatBirthday(birthday) {
  if (!birthday) return null;
  
  try {
    // Facebook returns birthday as "MM/DD/YYYY" or "MM/DD"
    const parts = birthday.split('/');
    if (parts.length < 2) return null;
    
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parts.length === 3 ? parseInt(parts[2], 10) : null;
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    
    let formatted = `${monthNames[month - 1]} ${day}`;
    if (year) {
      formatted += `, ${year}`;
    }
    
    return formatted;
  } catch (error) {
    console.warn('Error formatting birthday:', error);
    return null;
  }
}

// Format age range from Facebook format
function formatAgeRange(ageRange) {
  if (!ageRange) return null;
  
  try {
    // Facebook returns age_range as { min: 18 } or { min: 18, max: 24 }
    if (typeof ageRange === 'object' && ageRange.min) {
      if (ageRange.max) {
        return `${ageRange.min}–${ageRange.max}`;
      } else {
        return `${ageRange.min}+`;
      }
    }
    return null;
  } catch (error) {
    console.warn('Error formatting age range:', error);
    return null;
  }
}

// Fetch user data
function fetchUserInfo() {
  try {
    // First, check what permissions we have
    FB.api('/me/permissions', function(permissionsResponse) {
      console.log('Granted permissions:', permissionsResponse);
      
      // Check if birthday and age_range permissions are granted
      const hasBirthday = permissionsResponse.data && 
        permissionsResponse.data.some(p => p.permission === 'user_birthday' && p.status === 'granted');
      const hasAgeRange = permissionsResponse.data && 
        permissionsResponse.data.some(p => p.permission === 'user_age_range' && p.status === 'granted');
      
      console.log('Has birthday permission:', hasBirthday);
      console.log('Has age_range permission:', hasAgeRange);
    });

    // Fetch user profile data
    FB.api('/me', { fields: 'name,email,birthday,age_range,picture.type(large)' }, function (response) {
      if (!response || response.error) {
        console.error('Error fetching user info:', response && response.error);
        return;
      }

      // Debug: Log the full response to see what Facebook returns
      console.log('Facebook API Response:', response);
      console.log('Birthday value:', response.birthday);
      console.log('Age range value:', response.age_range);

      // Set basic user info
      document.getElementById('user-name').textContent = response.name || 'N/A';
      document.getElementById('user-email').textContent = response.email || 'Email not available';
      
      // Set profile picture
      if (response.picture && response.picture.data && response.picture.data.url) {
        document.getElementById('profile-picture').src = response.picture.data.url;
      }

      // Format and set birthday
      const formattedBirthday = formatBirthday(response.birthday);
      document.getElementById('user-birthday').textContent = formattedBirthday || 'Birthday not available';

      // Format and set age range
      const formattedAgeRange = formatAgeRange(response.age_range);
      document.getElementById('user-age-range').textContent = formattedAgeRange || 'Age range not available';

      userInfo.style.display = 'block';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      // Hide helper text in logged-in state
      if (helperText) {
        helperText.style.opacity = '0';
        helperText.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Error in fetchUserInfo:', error);
  }
}

