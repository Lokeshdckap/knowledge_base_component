const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Invite = db.invites;
const User = db.users;
const UserTeams = db.user_team_members;
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const sendEmail = require("../../utils/sendEmails");
const jwt = require("jsonwebtoken");

const inviteTeams = async (req, res) => {
  try {
    const email = req.body.email;
    const is_progress = 0;
    const team_uuid = req.body.team_uuid;
    const role = req.body.role;

    const exitsInviteUsers = await Invite.findOne({
      where: { email: email },
    });

    const sameUsers = await User.findOne({

      where: { uuid: req.user.id },
    });


    if(sameUsers.email == req.body.email){
    console.log(sameUsers.email,"ecjecle");

      return res.status(400).json(`This is your Email Can't send the invite`);
    };


    if (exitsInviteUsers) {
      return res.status(400).json(`${email} this email already sended invite`);
    } else {
      await Invite.create({
        email: email,
        is_progess: is_progress,
        uuid: uuid.v4(),
        team_uuid: team_uuid,
      });
      const exitsUsers = await User.findOne({
        where: { email: email },
      });

      let userId = exitsUsers ? exitsUsers.uuid : null;

      let payload = { id: userId, team_uuid: team_uuid, role: role };

      let inviteToken = jwt.sign(payload, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      let link = `http://localhost:3000/join/${inviteToken}`;

      const emailTemplate = fs.readFileSync(
        path.join(__dirname, "../../", "public", "emailTemplates/invite.html"),
        "utf8"
      );

      const emailink = emailTemplate.replace("{{link}}", link);

      await sendEmail(email, "Invite Notification", emailink);

      return res
        .status(200)
        .json(`Invite Sended Sucucessfully to this ${email}`);
    }
  } catch (error) {
    console.log(error,"errp");
    return res.status(404).json({ error: error });
  }
};

const updateInvite = async (req, res) => {
  try {
    const team_uuid = req.body.team_uuid;
    const role = req.body.role;

    const invitedData = await UserTeams.create({
      team_uuid: team_uuid,
      role_id: role,
      uuid: uuid.v4(),
      user_uuid: req.body.id,
    });

    const userFinds = await User.findOne({

      where:{
        uuid:req.body.id
      }
    })

    const invitedDataProgress = await Invite.update({
      is_progess: req.body.isProgress ,
    },
    {
      where: {
        uuid: userFinds.email
      },
    });

    return res
      .status(200)
      .json({ invitedData,invitedDataProgress, msg: "User Invited Update Sucessfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const updateRole = async (req, res) => {
  try {
    let team_uuid = req.body.team_uuid;
    let role_type = req.body.role_type;
    let updateData = {
      role_id: role_type,
    };
    try {
      const updatedRole = await UserTeams.update(updateData, {
        where: {
          [Op.and]: [
            { team_uuid: team_uuid },
            { user_uuid: req.body.user_uuid },
          ],
        },
      });
      return res
        .status(200)
        .json({ updatedRole, message: "Updated Sucessfully" });
    } catch (error) {
      return res.status(500).json({ error: "Updated Failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Updated Failed" });
  }
};

const pendingList = async (req, res) => {
  let teamuuid = req.params.uuid;
  try {
    const pendingData = await Invite.findAll({
      where: {
        [Op.and]: [
          { team_uuid: teamuuid},
          { is_progress: 0},
        ],
      },

    });
    return res
      .status(200)
      .json({ pendingData, message: "PendingData Get Sucessfully" });
  } catch (error) {
    return res.status(500).json({ error: "Updated Failed" });
  }
};

module.exports = {
  inviteTeams,
  updateInvite,
  updateRole,
  pendingList,
};
