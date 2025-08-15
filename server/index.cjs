const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: FB_REDIRECT_URI,
      profileFields: ["id", "displayName", "emails", "picture.type(large)"]
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Step 1: Start Facebook login
app.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email", "pages_show_list"] })
);

// Step 2: Callback from Facebook
app.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/api/pages");
  }
);

// Step 3: Fetch Pages using stored token
app.get("/api/pages", async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v20.0/me/accounts`,
      { headers: { Authorization: `Bearer ${req.user.accessToken}` } }
    );
    res.json(pagesResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Root
app.get("/", (req, res) => {
  res.send(req.user ? req.user : "Not logged in. <a href='/login/facebook'>Login with Facebook</a>");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
