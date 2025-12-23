SocialAuth Demo - Facebook Login
===============================

A modern, polished academic demo showing how to implement Facebook Login using OAuth 2.0 and the Facebook JavaScript SDK with a pure frontend (HTML, CSS, JavaScript) running over HTTPS via ngrok.

> **Important:** This project is for **development/demo use only**. The Facebook app should remain in **Development mode** and you must **not** expose the App Secret or add production features.

---

Project Overview
----------------

- Frontend-only demo (no backend).
- Uses the **Facebook JavaScript SDK** and **OAuth 2.0 implicit flow**.
- Requests permissions:
  - `public_profile`
  - `email`
  - `user_birthday`
  - `user_age_range`
- Demonstrates:
  - Login with Facebook
  - Logout
  - Re-login / account switching via Facebook dialogs
  - Displaying user **name**, **email**, **profile picture**, **birthday**, and **age range**.
  - Light/Dark mode toggle with persistent theme preference
  - Modern glassmorphism UI design
  - Smooth animations and transitions

Files
-----

- `index.html`  
  Main HTML page, loads the Facebook SDK and the app script, defines the UI (card, buttons, profile, theme toggle).

- `style.css`  
  Modern, responsive styling with glassmorphism effects:
  - Centered card with glassmorphism (backdrop blur, transparency)
  - Gradient backgrounds (light/dark mode)
  - Global theme toggle (fixed top-right)
  - Rounded corners and soft shadows
  - Animated transitions and refined typography
  - Responsive design for mobile devices

- `script.js`  
  Facebook SDK integration and UI state logic:
  - Initializes `FB.init` with the provided App ID
  - Uses `FB.login`, `FB.logout`, and `FB.api`
  - Handles logged-in vs logged-out UI states
  - Fetches and displays user profile data (name, email, picture, birthday, age range)
  - Theme management with localStorage persistence
  - Shows helper text only when logged out
  - Error handling and debugging logs

Prerequisites
-------------

- **Python** (any recent 3.x) or another simple static file server.
- **ngrok** executable in the project folder (already present in this project).
- A **Facebook App** configured with:
  - App Name: `SocialAuth Demo`
  - App ID: `1386670096483873`
  - Status: **In Development**
  - Valid OAuth Redirect URI:
    - `https://YOUR-NGROK-SUBDOMAIN.ngrok-free.dev/`

> Make sure the ngrok HTTPS URL you actually get matches exactly (including trailing `/`) in the Facebook app settings.

How to Run the Demo
-------------------

1. **Open a terminal in the project folder**

```bash
cd "C:\Users\Lenovo\Desktop\ELEC3-FINAL-PROJECT\SocialAuth Demo"
```

2. **Start a local static server**

Using Python 3:

```bash
python -m http.server 5500
```

Leave this terminal open and running.

3. **Start ngrok (HTTPS tunnel)**

Open a **second** terminal in the same folder and run:

```bash
ngrok.exe http 5500 --host-header="localhost:5500"
```

ngrok will print a forwarding URL such as:

```text
https://nondeclaratively-ledgy-gloria.ngrok-free.dev/
```

4. **Configure Facebook App redirect URI (if needed)**

In the **Meta for Developers** dashboard:

1. Go to your app **SocialAuth Demo**.
2. Navigate to **Facebook Login → Settings**.
3. Under **Valid OAuth Redirect URIs**, add **your current** ngrok HTTPS URL, e.g.  
   `https://nondeclaratively-ledgy-gloria.ngrok-free.dev/`
4. Save changes.

> If you restart ngrok and the URL changes, update this setting again.

5. **Open the demo**

In your browser, open the **ngrok HTTPS URL** (not `localhost`), for example:

```text
https://nondeclaratively-ledgy-gloria.ngrok-free.dev/
```

You should see the **SocialAuth Demo** card.

Features
--------

### Authentication
- **Facebook Login**: Secure OAuth 2.0 authentication
- **Account Switching**: Re-authentication dialog for switching accounts
- **Session Management**: Persistent login state

### User Profile Data
- **Basic Info**: Name, email, profile picture
- **Extended Info**: Birthday (formatted), age range
- **Graceful Fallbacks**: Shows "not available" if permissions are denied or data is missing

### UI/UX Features
- **Light/Dark Mode**: Global theme toggle with persistent preference
- **Glassmorphism Design**: Modern frosted glass effect on card
- **Smooth Animations**: Fade-in, slide-up transitions
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Visual Hierarchy**: Clear typography and spacing

Using the Demo
--------------

### Theme Toggle

- **Location**: Fixed at the top-right corner of the page
- **Functionality**: 
  - Click to switch between light and dark modes
  - Preference is saved in localStorage
  - Persists across page refreshes

### Logged Out State

- Visible:
  - **Login with Facebook** button (with gradient and hover effects)
  - Helper text: "You'll be redirected to Facebook to continue"
  - Global theme toggle (top-right)
- Hidden:
  - Profile section (photo, name, email, birthday, age range)
  - Logout button

Click **Login with Facebook**:

- Facebook will open a login/re-authentication dialog.
- You'll be prompted to grant permissions for:
  - Public profile
  - Email
  - Birthday
  - Age range
- On success, you are redirected back and the app fetches:
  - Name
  - Email
  - Profile picture
  - Birthday (formatted as "Month Day, Year" or "Month Day")
  - Age range (formatted as "18–24", "25–34", etc.)

### Logged In State

- Visible:
  - Profile picture (circular with soft ring)
  - User name and email
  - Birthday and age range (if permissions granted)
  - **Log out** button (outlined secondary style)
  - Global theme toggle (top-right)
- Hidden:
  - Helper text
  - Login button

Click **Log out**:

- Calls `FB.logout()` to log out of the app.
- Resets UI to the logged-out state.
- Clears all displayed user data.
- Shows the helper text and login button again.
- On next login, Facebook can show options like:
  - "Continue as [Name]"
  - Or allow switching to another account (depending on browser/Facebook session).

Security & Policy Notes
-----------------------

- This project:
  - Does **not** include any backend.
  - Does **not** store tokens or user data on a server.
  - Does **not** expose the **App Secret**.
  - Stores only theme preference in localStorage (client-side only).
- Keep the Facebook app in **Development mode** for testing.
- Permissions requested: `public_profile`, `email`, `user_birthday`, `user_age_range`.
- Always access the demo via **HTTPS** (the ngrok URL), because the Facebook SDK requires a secure origin.
- Birthday and age range permissions may require App Review for production use.

Troubleshooting
---------------

### Authentication Issues

- **SDK or login errors in console**
  - Make sure:
    - The page is loaded via the **ngrok HTTPS URL**.
    - The ngrok URL matches the **Valid OAuth Redirect URI** in your Facebook app.

- **Popup blocked**
  - Ensure your browser allows popups for the ngrok URL.

- **Ad blocker warnings**
  - Some console messages may appear because ad blockers block Facebook analytics endpoints.  
    These do not affect the core login functionality.

### Birthday & Age Range Not Showing

If birthday or age range shows as "not available":

1. **Check Browser Console** (F12 → Console tab):
   - Look for "Facebook API Response:" to see what data Facebook returned
   - Check "Granted permissions:" to verify permissions were granted
   - Review any error messages

2. **Re-authenticate**:
   - Log out completely
   - Log back in and explicitly grant the birthday and age_range permissions
   - Facebook will prompt you to grant these permissions during login

3. **Facebook App Configuration**:
   - Ensure your Facebook App has `user_birthday` and `user_age_range` permissions enabled
   - In Development mode, only test users can grant these permissions
   - For production, these permissions require App Review

4. **User Privacy Settings**:
   - The user's Facebook privacy settings may hide their birthday
   - Ask the user to check their Facebook privacy settings

5. **Permission Status**:
   - Open browser console and check the "Granted permissions" log
   - Verify that `user_birthday` and `user_age_range` show status: "granted"

### Theme Toggle Issues

- **Theme not persisting**:
  - Check if localStorage is enabled in your browser
  - Clear browser cache and try again

- **Toggle not visible**:
  - Ensure the page is fully loaded
  - Check browser console for JavaScript errors

License
-------

This project is intended for educational and academic demonstration purposes only.


