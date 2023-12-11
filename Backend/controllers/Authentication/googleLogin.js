const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require("../../utils/database");
const User = db.users;
const configAuth = require("../../middleware/auth");
const generateAuthToken = require("../../utils/generateAuthToken");
const uuid = require("uuid");
const google = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "1009276001337-tvc5n33me839uroo68b4iamrll2bj1uc.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:4000/api/auth/auth/google/callback",
        scope: ['openid', 'profile', 'email']
      },
      async (req, accessToken, refreshToken, profile, done) => {
        // console.log(req);


        const newUser = {
          google_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          isVerified : true,
          uuid : uuid.v4(),
        };

        try {
          let user = await User.findOne({ google_id: profile.id });
        
          if (user) {
            let token = generateAuthToken.generateAuthToken(user);
            return done(null, user, { access_token: token }); // Pass the token as additional info
          } else {
            user = await User.create(newUser);
        
            let token = generateAuthToken.generateAuthToken(user);
        
            return done(null, user, { access_token: token }); // Pass the token as additional info
          }
        } catch (err) {
          console.error(err);
        }
        
        // return done(null, profile);
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
