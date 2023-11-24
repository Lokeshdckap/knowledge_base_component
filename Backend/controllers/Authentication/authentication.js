const bcrypt = require("bcrypt");
const db = require("../../utils/database");
const path = require("path");
const fs = require("fs");
const User = db.users;
const emailVerificationToken = db.email_verification_token; // Email Verification Token
const Joi = require("joi");
const crypto = require("crypto");
const tokens = require("../../utils/generateAuthToken");
const generateAuthToken = tokens.generateAuthToken;
const generateAuthRefreshToken = tokens.generateAuthRefreshToken;
const sendEmail = require("../../utils/sendEmails");
const uuid = require("uuid");
const UserTeams = db.user_team_members;
const { registrationSchema, loginSchema } = require("../../utils/validations");

const register = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const { username, email, password } = req.body;

    // Check if the email exists

    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) {
      return res.status(400).send("Email is already exists");
    }
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 15),
      uuid: uuid.v4(),
    });

    if (req.body.team_uuid) {
      const UserTeam = await UserTeams.create({
        user_uuid: user.uuid,
        team_uuid: req.body.team_uuid,
        role_id: req.body.role,
        uuid: uuid.v4(),
      });
    }

    if (user) {
      const expiresAt = new Date(Date.now() + 3600000);
      let setToken = await new emailVerificationToken({
        user_uuid: user.uuid,
        token: crypto.randomBytes(32).toString("hex"),
        expires_at: expiresAt,
      }).save();

      if (setToken) {
        const link = `http://localhost:3000/email-verify/${user.uuid}/${setToken.token}`;

        const emailTemplate = fs.readFileSync(
          path.join(__dirname, "../../", "public", "emailTemplates/index.html"),
          "utf8"
        );

        const emailink = emailTemplate.replace("{{link}}", link);

        await sendEmail(user.email, "Email Verification", emailink);
      } else {
        return res.status(400).send("token not created");
      }
      return res.status(200).send({ verify: user.isVerified });
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (err) {
    return res.status(500).send("Error in registering user");
  }
};

const login = async (req, res) => {
  try {
    // validation

    const { error } = loginSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = generateAuthToken(user);

        let refresh_token = generateAuthRefreshToken(user);

        return res
          .status(200)
          .send({ token, refresh_token, verify: user.isVerified });
      } else {
        return res.status(401).send({ password: "Invaild Crendtials" });
      }
    } else {
      return res.status(401).send({ email: "Invaild Crendtials" });
    }
  } catch (error) {
    console.log("eee", error);
    return res.status(400).send({ email: "Email Not Verified" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(req.params);
    console.log(req.params.uuid);

    //find user by token using the where clause
    if (req.params.uuid) {
      const usertoken = await emailVerificationToken.findOne({
        token,
        where: {
          user_uuid: req.params.uuid,
        },
      });

      const userTeamAvailable = await UserTeams.findOne({
        where: {
          user_uuid: req.params.uuid,
        },
      });

      //if token doesnt exist, send status of 400
      if (usertoken.expires_at < new Date()) {
        return res
          .status(400)
          .json({ message: "Token has expired or Invaild Token" });
      }
      if (!usertoken) {
        return res.status(400).send({
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });

        //if token exist, find the user with that token
      } else {
        const user = await User.findOne({ where: { uuid: req.params.uuid } });
        if (!user) {
          return res.status(401).send({
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });

          //if user is already verified, tell the user to login
        } else if (user.isVerified) {
          let jwttoken = generateAuthToken(user);
          // JWT TokeN
          return res
            .status(200)
            .send({ verify: user.isVerified, jwttoken, userTeamAvailable });

          //if user is not verified, change the verified to true by updating the field
        } else {
          const updated = await User.update(
            { isVerified: true },
            {
              where: {
                uuid: usertoken.user_uuid,
              },
            }
          );

          const user = await User.findOne({
            where: {
              uuid: usertoken.user_uuid,
            },
          });

          //if not updated sencsrfd error message
          if (!updated) {
            return res.status(500).send({ msg: err.message });
            //else send status of 200
          } else {
            return res.status(200).send({
              Success: "Your account has been successfully verified",
              verify: user.isVerified,
              token,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const resendEmailLink = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findOne({ where: { email: userEmail } });
    // user is not found into database
    if (!user) {
      return res.status(400).send({
        msg: "We were unable to find a user with that email. Make sure your Email is correct!",
      });
    }
    // user has been already verified
    else if (user.isVerified) {
      return res
        .status(200)
        .send("This account has been already verified. Please log in.");
    }
    // send verification link
    else {
      if (user) {
        const expiresAt = new Date(Date.now() + 3600000);
        let setToken = await new emailVerificationToken({
          user_uuid: user.uuid,
          token: crypto.randomBytes(32).toString("hex"),
          expires_at: expiresAt,
        }).save();

        if (setToken) {
          const link = `http://localhost:3000/email-verify/${user.uuid}/${setToken.token}`;

          const emailTemplate = fs.readFileSync(
            path.join(
              __dirname,
              "../../",
              "public",
              "emailTemplates/index.html"
            ),
            "utf8"
          );

          const emailink = emailTemplate.replace("{{link}}", link);

          await sendEmail(user.email, "Email Verification", emailink);
        } else {
          return res.status(400).send("token not created");
        }
        return res.status(200).send({ verify: user.isVerified });
        // return res.status(302).send('Please Verify Your Email')
      } else {
        return res.status(409).send("Details are not correct");
      }
    }
  } catch (err) {
    return res.status(500).send("Error in resend link send to user");
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendEmailLink,
};
