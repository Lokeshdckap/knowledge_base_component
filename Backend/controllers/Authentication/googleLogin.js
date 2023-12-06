const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require("passport");
const db = require("../../utils/database");
const User = db.users;
const configAuth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const generateAuthToken = require("../../utils/generateAuthToken");
const google = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "1009276001337-tvc5n33me839uroo68b4iamrll2bj1uc.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/api/auth/auth/google/callback",
        passReqToCallback : true
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          google_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ google_id: profile.id });

          if (user) {
            let token = generateAuthToken(user);
            done(null, user);
            return res.status(200).send({ token, user });
          } else {
            user = await User.create(newUser);

            let token = generateAuthToken(user);

            done(null, user);

            return res.status(200).send({ token, user });
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
module.exports = {
  google,
  // Add other controller methods here
};
