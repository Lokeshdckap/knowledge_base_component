const db = require("../../utils/database");
const User = db.users;
const Teams = db.teams;
const uuid = require("uuid");

const { createTeamSchema } = require("../../utils/validations");

const createTeams = async (req, res) => {
  try {
    const { error } = createTeamSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const team_name = req.body.team_name;

    const teamExists = await Teams.findOne({ where: { name: team_name } });

    if (teamExists) {
      return res.status(400).send({Error:`${teamExists.name} Team Is Already Exists`});
    } else {
      const newTeam = await Teams.create({
        name: team_name,
        uuid: uuid.v4(),
        user_uuid: req.user.id,
      });

      if (newTeam) {
        return res.status(200).send({
          Success: "Your Team Created Sucessfully",
        });
      } else {
        return res.status(500).send({
          Error: "Error Team Not Created",
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      Error: "Error Team Not Created",
    });
  }
};
module.exports = {
  createTeams,
};
