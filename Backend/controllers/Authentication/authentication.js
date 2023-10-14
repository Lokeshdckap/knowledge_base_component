const bcrypt = require("bcrypt");
const db = require("../../utils/database");
const path = require("path");
const fs = require("fs");
const User = db.users;
const emailVerificationToken = db.email_verification_token; // Email Verification Token
const Joi = require("joi");
const crypto = require("crypto");
const generateAuthToken = require("../../utils/generateAuthToken");
const sendEmail = require("../../utils/sendEmails");
const {
  registrationSchema,
  loginSchema,
} = require("../../utils/userValidations");
const uuid = require("uuid");

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
    });

    if (user) {
      let setToken = await new emailVerificationToken({
        user_uuid: user.uuid,
        token: crypto.randomBytes(32).toString("hex"),
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
      // return res.status(302).send('Please Verify Your Email')
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

        return res.status(200).send({ token, verify: user.isVerified });
      } else {
        return res.status(401).send({ password: "Invaild Crendtials" });
      }
    } else {
      return res.status(401).send({ email: "Invaild Crendtials" });
    }
  } catch (error) {
    console.log("error",error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    //find user by token using the where clause
    const usertoken = await emailVerificationToken.findOne({
      token,
      where: {
        user_uuid: req.params.uuid,
      },
    });

    //if token doesnt exist, send status of 400
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
        return res.status(200).send({ verify: user.isVerified, jwttoken });

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
        console.log(updated);

        const user = await User.findOne({
          where: {
            uuid: usertoken.user_uuid,
          },
        });
        console.log(user);

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
  } catch (error) {
    console.log(error);
  }
};

const resendEmailLink = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.id } });
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
  }
};
module.exports = {
  register,
  login,
  verifyEmail,
};
