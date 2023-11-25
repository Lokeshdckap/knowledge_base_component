const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const User = db.users;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../../utils/sendEmails");
const getUserInfo = async (req, res) => {
  const userInfo = await User.findOne({
    where: {
      uuid: req.user.id,
    },
  });
  if (userInfo) {
    return res
      .status(200)
      .json({ userInfo, message: "UserInfo Fetched Sucessfully" });
  } else {
    return res.status(404).json({ error: "No matching records found!" });
  }
};

const userUpdateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const username = req.body.username;

    const oldPassword = req.body.oldPassword;

    const newPassword = req.body.newPassword;

    const confirmNewPassword = req.body.confirmNewPassword;

    if (user_id) {
      const userFind = await User.findOne({
        where: {
          uuid: user_id,
        },
      });
      if (userFind && username) {
        let updateData = {
          username: username,
        };
        await User.update(updateData, {
          where: {
            uuid: user_id,
          },
        });
        return res
          .status(200)
          .json({ message: "UserDetails Update Sucessfully" });
      }

      if (userFind && oldPassword && newPassword && confirmNewPassword) {
        const passwordMatch = await bcrypt.compare(
          oldPassword,
          userFind.password
        );
        if (!passwordMatch) {
          return res.status(404).json({
            error: "Old Password doesn't match our credentials",
          });
        } else {
          if (newPassword != confirmNewPassword) {
            return res.status(404).json({
              error: "New Password Password doesn't match confirmNewPassword",
            });
          } else {
            let updateData = {
              password: await bcrypt.hash(confirmNewPassword, 15),
            };
            await User.update(updateData, {
              where: {
                uuid: user_id,
              },
            });

            const emailTemplate = fs.readFileSync(
              path.join(
                __dirname,
                "../../",
                "public",
                "emailTemplates/passwordChanged.html"
              ),
              "utf8"
            );
            let link = `http://localhost:3000/signin`;

            const emailink = emailTemplate.replace("{{link}}", link);

            await sendEmail(
              userFind.email,
              "Password Changed Notification",
              emailink
            );

            return res
              .status(200)
              .json({ message: "Password Update Sucessfully" });
          }
        }
      } else {
        return res.status(404).json({ error: "No matching records found!" });
      }
    }
  } catch (err) {
    return res.status(404).json({ error: "No matching records found!" });
  }
};

module.exports = {
  getUserInfo,
  userUpdateProfile,
};
