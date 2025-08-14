const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// FACEBOOK_APP_ID=1481486629939190
// FACEBOOK_APP_SECRET=d740265d178aa62550b578362c46fc6d
// CALLBACK_URL=http://localhost:5000/auth/facebook/callback
// SESSION_SECRET=secret123

// FACEBOOK_CLIENT_ID=1053055676988098
// FACEBOOK_CLIENT_SECRET=1b40a0ed7c6009420fe18ba1e1caf826
// FB_REDIRECT_URI=http://localhost:3000/facebook/callback



const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "/facebook",
      profileFields: ["emails", "displayName", "name", "picture"],
    },
    (accessToken, refreshToken, profile, callback) => {
      profile.accessToken = accessToken;
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email", "pages_show_list"] })
);

app.get("/facebook", passport.authenticate("facebook"), (req, res) => {
  const fbAuthURL = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    FB_REDIRECT_URI
  )}&scope=email,public_profile,pages_show_list`;
  res.redirect(fbAuthURL);
});


app.get("/api/pages", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v20.0/oauth/access_token`,
      {
        params: {
          client_id: FACEBOOK_CLIENT_ID,
          client_secret: FACEBOOK_CLIENT_SECRET,
          redirect_uri: FB_REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/me/accounts`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(pagesResponse.data.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Facebook login failed" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  res.send(req.user ? req.user : "Not logged in, login with Facebook");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});
