# Facebook OAuth + Pages API (Server + Minimal Client)

This project demonstrates Facebook OAuth login and fetching the list of Facebook Pages linked to a user account.

## 📌 Features
- Facebook login using OAuth 2.0 (`passport-facebook`)
- Server-side fetching of Facebook Pages via Graph API
- Minimal HTML client to display pages list after login
- Uses `.env` file for sensitive configuration
- Session handling with `express-session`

---

## 🛠 Prerequisites
- Node.js v18+
- Facebook Developer Account
- A Facebook App created in [Facebook Developers Console](https://developers.facebook.com/)

---

## ⚙️ Setup

### 1. Facebook Developer Console
1. Create a new Facebook App.
2. Go to **Settings > Basic** and get your **App ID** and **App Secret**.
3. In **Facebook Login > Settings**, add:

under **Valid OAuth Redirect URIs**.
4. Add `pages_show_list` permission in **App Review > Permissions**.
5. Add `shridhar.patil@zoho.com` as **Developer/Tester/Admin**.
Note: The email (shridhar.patil@zoho.com) could not be added as Developer/Tester/Admin because the Facebook Developer Console did not show the option to add users for this app, possibly due to its development mode and pending app review.


---

### 2. Server Setup
```bash
cd server
npm install express passport passport-facebook express-session axios dotenv cors
