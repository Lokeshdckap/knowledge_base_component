const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const User = db.users;
const UserTeams = db.user_team_members;
const { createTeamSchema } = require("../../utils/validations");
const uuid = require("uuid");

const createTeams = async (req, res) => {
  try {
    const { error } = createTeamSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const team_name = req.body.team_name;

    const user = req.user.id;

    const teamExists = `select teams.name from user_team_members inner join teams on user_team_members.team_uuid = teams.uuid inner join users on user_team_members.user_uuid = users.uuid where users.uuid = :user and teams.name = :team_name `;

    const [results] = await sequelize.query(teamExists, {
      replacements: { user, team_name },
    });

    if (results.length) {
      return res
        .status(400)
        .send({ team_name: `${results[0].name} Team Is Already Exists` });
    } 
    
    else if (team_name && user){

      const newTeam = await Team.create({
        name: team_name,
        uuid: uuid.v4(),
      });
      const usersTeam = await UserTeams.create({
        user_uuid: req.user.id,
        uuid: uuid.v4(),
        team_uuid: newTeam.uuid,
        role_id: "1",
      });
      if (newTeam && usersTeam) {
        return res.status(200).send({
          Success: "Your Team Created Sucessfully",
          newTeam,
        });
      } else {
        return res.status(500).send({
          Error: "Error Team Not Created",
        });
      }
    }
    else{
      return res.status(500).send({
        Error: "Error Team Not Created",
      });
    }

  } catch (err) {
    return res.status(500).send({
      Error: err.message,
    });
  }
};

const getTeam = async (req, res) => {
  try {
    const Teams = await Team.findAll({
      where: { uuid: req.params.uuid },
    });

    return res
      .status(200)
      .json({ Teams, msg: "Sucessfully Fetched All Teams" });
  } catch (error) {
    return res.status(500).json({ error: "Can't Get All Team" });
  }
};

const teamNameUpdate = async (req, res) => {
  try {
    const team_uuid = req.body.uuid;
    const updateName = req.body.name;
    const updateData = {};

    updateData.name = updateName;

    await Team.update(updateData, {
      where: { uuid: team_uuid },
    });

    return res.status(200).send({
      Success: "Your Team Name Sucessfully Updated",
    });
  } catch (err) {
    return res.status(400).send({
      Error: "Your Team Name Cannot Updated",
    });
  }
};

const getActiveUsersForTeam = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;
    const userDetail = await User.findAll({
      attributes: ["username", "isAdmin", "email", "uuid"],
      include: {
        model: UserTeams,
        where: { team_uuid: team_uuid }, // Filter by team_uuid
      },
    });
    return res.status(200).json({
      userDetail,
      msg: "Sucessfully Fetched Active Users",
    });
  } catch (error) {
    return res.status(500).json({ error: "Can't Get a Active Users" });
  }
};

const switchTeam = async (req, res) => {
  try {
    const selectedTeam = await Team.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });

    return res.status(200).send({
      selectedTeam,
      msg: "Sucessfully Switched Team",
    });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

const getAllTeam = async (req, res) => {
  try {
    const user = req.user.id;
    const query = `select * from user_team_members inner join teams on user_team_members.team_uuid = teams.uuid inner join users on user_team_members.user_uuid = users.uuid where users.uuid = :user`;

    const [getAllTeam] = await sequelize.query(query, {
      replacements: { user },
    });
    return res.status(200).send({
      getAllTeam,
      msg: "Sucessfully Fetched All Teams",
    });
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
};

const searchActiveUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const team_uuid = req.params.uuid;
    // try {
    //   if (!q) {
    //     return res.status(404).json({ error: "Datas Not Found" });
    //   }

    //   const users = await UserTeams.findAll({
    //     where: {
    //       team_uuid: team_uuid,
    //     },
    //     include: [
    //       {
    //         model: User,
    //         where: {
    //           username: {
    //             [Op.iLike]: `%${q}%`,
    //           },
    //         },
    //         attributes: ['id', 'username', 'email'], // Add attributes as needed
    //       },
    //     ],
    //   });

    //   return res.status(200).json(users);
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ error: "Internal Server Error" });
    // }

    const usersInTeamQuery = `
              SELECT username
              FROM "user_team_members" AS "user_team_members"
              INNER JOIN "users" AS "user" ON "user_team_members"."user_uuid" = "user"."uuid" AND ("user"."username" ILIKE :username)
              WHERE "user_team_members"."team_uuid" = :team_uuid;
            `;
    try {
      const [results] = await sequelize.query(usersInTeamQuery, {
        replacements: { team_uuid, username: `%${q}%` },
      });

      return res.status(200).json({ results, msg: "SucessFully Finded" });
    } catch (error) {
      res.status(500).json({ err: error });
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  createTeams,
  getTeam,
  teamNameUpdate,
  getActiveUsersForTeam,
  switchTeam,
  getAllTeam,
  searchActiveUsers,
};
