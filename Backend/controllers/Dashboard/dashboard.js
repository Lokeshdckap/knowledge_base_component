const db = require("../../utils/database");
const User = db.users;
const Team = db.teams;
const Batch = db.batch;
const uuid = require("uuid");

const {
  createTeamSchema,
  createTypeSchema,
} = require("../../utils/validations");

const createTeams = async (req, res) => {
  try {
    const { error } = createTeamSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const team_name = req.body.team_name;

    const teamExists = await Team.findOne({ where: { name: team_name } });

    if (teamExists) {
      
      return res.status(400).send({"team_name":`${teamExists.name} Team Is Already Exists`});

    } else {
      const newTeam = await Team.create({
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

const getTeam = async (req, res) => {
  try {
    const Teams = await Team.findAll(); // This performs a SELECT * query on the "users" table
    res.json(Teams);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addNewBatch = async (req, res) => {
    
    const team_uuid = req.body.uuid

  const batch = await Batch.create({  
    uuid: uuid.v4(),
    team_uuid : team_uuid,
  });
  // console.log(batch)
  if (batch) {
    return res.status(200).send({
      Success: "Your Batch Created Sucessfully",
    });
  } else {
    return res.status(500).send({
      Error: "Error Batch Not Created",
    });
  }
};

const getBatch = async(req,res)=>{

  
  const batchs = await Batch.findAll( {where: {
    team_uuid: req.params.uuid
  }});
   
  return res.status(200).send({
    batchs,
  });
}

module.exports = {
  createTeams, 
  getTeam,
  addNewBatch,
  getBatch,
};
