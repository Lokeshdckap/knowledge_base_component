const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../../utils/database");
const User = db.users;

const uuid = require("uuid");

const googleLogin = async () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "1009276001337-tvc5n33me839uroo68b4iamrll2bj1uc.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, cb) => {
        try {
          // Check if the email exists in the database for sign-up
          const existingUser = await User.findOne({
            where: { email: profile.emails[0].value },
          });
       if(existingUser){
           if (existingUser.password != null) {
            const error = new Error(
              "This email is already registered. Please sign in using your existing credentials."
            );
            return cb(error, null);
          }
       }
          if (existingUser) {
            if (existingUser.google_id) {
              // User is trying to sign in with Google, proceed with sign-in
              return cb(null, existingUser);
            } 
          }
          // If the email doesn't exist, proceed with signing up
          const defaultUser = {
            google_id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            isVerified: true,
            uuid: uuid.v4(),
          };

          const newUser = await User.findOrCreate({
            where: { google_id: profile.id },
            defaults: defaultUser,
          });

          if (newUser && newUser[0]) return cb(null, newUser && newUser[0]);
        } 
        catch (error) {
          console.log("Error during sign-up with Google", error);
          return cb(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    const user = await User.findOne({ where: { id } }).catch((err) => {
      console.log("Error deserializing", err);
      cb(err, null);
    });


    if (user) cb(null, user);
  });
};
module.exports = {
  googleLogin,
};
