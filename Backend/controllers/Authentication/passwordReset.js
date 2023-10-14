const db = require("../../utils/database");

const bcrypt = require("bcrypt");

const User = db.users;;

const Token = db.password_reset_token;

const sendEmail = require("../../utils/sendEmails");

const crypto = require("crypto");

const Joi = require("joi");

const path = require("path");

const fs = require("fs");

const {passwordResetSchema} = require("../../utils/userValidations");


const forgotPassword = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });
    // return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // console.log(user.id);
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ user_id: user.id });
    const expiresAt = new Date(Date.now() + 3600000);
    if (!token) {
      token = await new Token({
        user_uuid: user.uuid,
        token: crypto.randomBytes(32).toString("hex"),
        expires_at: expiresAt,
      }).save();
    }

    const link = `${"http://localhost:3000"}/changepassword/${user.uuid}/${
      token.token
    }`;

    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../", "public", "emailTemplates/resetPassword.html"),
      "utf8"
    );

    const resetlink = emailTemplate.replace("{{link}}", link);

    await sendEmail(user.email, "Password reset",resetlink);

    res.send("password reset link sent to your email account");
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
      
    const { error } = passwordResetSchema.validate(req.body);

    if (error) return res.status(400).json({ error: "failed" });

    const user = await User.findOne({ where: { uuid: req.params.uuid } });

    console.log(user);

    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      user_uuid: user.uuid,
      token: req.params.token,
    });
     console.log(token,"ll");
    if (token.expires_at < new Date()) {
      return res
        .status(400)
        .json({ message: "Token has expired or Invaild Token" });
    }
    if (!token) {
      return res.status(400).send("Invalid link or expired");
    }

    // Hash the new password and update user's password
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    await user.save();

    await token.destroy();

    res.status(200).json({ message: "Password reset successful" });
  } 
  catch (error) {
    res.send("An error occured");
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
