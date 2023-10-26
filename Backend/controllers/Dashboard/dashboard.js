const db = require("../../utils/database");
const { Op } = require('sequelize');
const User = db.users;
const Team = db.teams;
const Batch = db.batch;
const Script = db.script;
const uuid = require("uuid");

const {
  createTeamSchema,
  createTypeSchema,
} = require("../../utils/validations");

const teams = require("../../models/teams");
const batch = require("../../models/batch");

const createTeams = async (req, res) => {
  try {
    const { error } = createTeamSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const team_name = req.body.team_name;

    const teamExists = await Team.findOne({ where: { name: team_name } });

    if (teamExists) {

      return res
        .status(400)
        .send({ team_name: `${teamExists.name} Team Is Already Exists` });

      
      return res.status(400).send({"team_name":`${teamExists.name} Team Is Already Exists`});
    } else {
      const newTeam = await Team.create({
        name: team_name,
        uuid: uuid.v4(),
        user_uuid: req.user.id,
      });

      if (newTeam) {
        return res.status(200).send({
          Success: "Your Team Created Sucessfully",newTeam,
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

    const Teams = await Team.findAll({
      where: {
        [Op.and]: [{ uuid: req.params.uuid }, { user_uuid: req.user.id }],
      },
    });
    res.status(200).json(Teams);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addNewBatch = async (req, res) => {

  const team_uuid = req.body.uuid;

  // console.log(req.body);
    const batch = await Batch.create({  

    uuid: uuid.v4(),
    team_uuid: team_uuid,
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




const addNewScripts = async (req, res) => {

  const team_uuid = req.body.uuid;
  const batch_uuid = req.body.batch_uuid


  const script = await Script.create({  
    uuid: uuid.v4(),
    team_uuid : team_uuid,
    batch_uuid: batch_uuid ? batch_uuid : null,

  });
  if (script) {
    return res.status(200).send({
      Success: "Your Script Created Sucessfully",
    });
  } else {
    return res.status(500).send({
      Error: "Error Script Not Created",
    });
  }


};


const getBatch = async(req,res)=>{
  // console.log(req.params);
  
  const batchs = await Batch.findAll( {where: {
    team_uuid: req.params.uuid
  }});
  return res.status(200).send({
    batchs
  });
}


const switchTeam = async(req,res)=>{

 
  const selectedTeam = await Team.findOne( {where: {
    uuid: req.params.uuid
  }});
   
  return res.status(200).send({
    selectedTeam,
  });
}

const getScript = async(req,res)=>{

  const script = await Script.findAll( {where: {
    team_uuid: req.params.uuid
  }});
   
  return res.status(200).send({
    script,
  });
}

const getAllTeam = async(req,res)=>{
  const getAllTeam = await Team.findAll( {where: {
    user_uuid: req.user.id
  }});
   
  return res.status(200).send({
    getAllTeam,
  });
};







const getBatchAndScripts = async (req, res) => {

  const result = await Script.findOne({
    where: {
      uuid: '78c310bf-8440-427d-945e-c13e876cc3a6', // WHERE condition for the Script model
    },
    include: [
      {
        model: Batch,
        where: {
          batch_uuid: '5db6af32-b5d4-4dd9-9e49-fe8083e14ed8', // WHERE condition for the Batch model
        },
        include: [
          {
            model: Team,
            where: {
              team_uuid: '545c7844-20f9-4d15-b370-245e85124262', // WHERE condition for the Team model
            },
          },
        ],
      },
    ],
  });
 res.status(200).send(result)
};


module.exports = {
  createTeams,
  getTeam,
  addNewBatch,
  getBatch,
  switchTeam,
  addNewScripts,
  getScript,
  getAllTeam,
};
