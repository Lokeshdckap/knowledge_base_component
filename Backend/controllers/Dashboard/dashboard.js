const db = require("../../utils/database");
const { Op } = require("sequelize");
const User = db.users;
const Team = db.teams;
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;

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
      return res
        .status(400)
        .send({ team_name: `${teamExists.name} Team Is Already Exists` });
    } else {
      const newTeam = await Team.create({
        name: team_name,
        uuid: uuid.v4(),
        user_uuid: req.user.id,
      });

      if (newTeam) {
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
  const batch_uuid = req.body.batch_uuid;

  const script = await Script.create({
    uuid: uuid.v4(),
    team_uuid: team_uuid,
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

const getBatch = async (req, res) => {
  // console.log(req.params);

  const batchs = await Batch.findAll({
    where: {
      team_uuid: req.params.uuid,
    },
  });
  return res.status(200).send({
    batchs,
  });
};

const switchTeam = async (req, res) => {
  const selectedTeam = await Team.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  return res.status(200).send({
    selectedTeam,
  });
};

const getScript = async (req, res) => {
  const script = await Script.findAll({
    where: {
      [Op.and]: [{ team_uuid: req.params.uuid }, { batch_uuid: null }],
    },
  });
  return res.status(200).send({
    script,
  });
};

const getAllTeam = async (req, res) => {
  const getAllTeam = await Team.findAll({
    where: {
      user_uuid: req.user.id,
    },
  });

  return res.status(200).send({
    getAllTeam,
  });
};

const getBatchAndScripts = async (req, res) => {
  let result = await Script.findAll({
    include: [
      {
        model: Batch,
        where: {
          uuid: req.params.batch_uuid, // WHERE condition for the Batch model
        },
        include: [
          {
            model: Team,
            where: {
              uuid: req.params.team_uuid, // WHERE condition for the Team model
            },
          },
        ],
      },
    ],
  });
  return res.status(200).json({ result });
};

const addPageData = async (req, res) => {
  const script_uuid = req.params.script_uuid;
  const pages_uuid = "3d090138-cf17-4e8e-b943-edd192b36ee1";

  const Pages = await Page.create({
    title: "Page Name",
    description: "Page Description",
    uuid: uuid.v4(),
    script_uuid: script_uuid,
    content: "<p>Hello DCKAP R&D</p>",
    page_uuid: pages_uuid ? pages_uuid : null,
  });

  return res.status(200).json({ Pages });
};

const getScriptAndPage = async (req, res) => {
  const script_uuid = req.params.script_uuid;

  async function fetchPagesWithDynamicChildInclude() {
    const rootPages = await Page.findAll({
      where: { page_uuid: null }, // Fetch root-level pages
      include: [
        {
          model: Script,
          where: {
            uuid: script_uuid, // WHERE condition for the Page model
          },
        },
      ],
    });

    const hierarchy = await organizePagesInHierarchy(rootPages);

    return hierarchy;
  }

  async function organizePagesInHierarchy(pages) {
    const hierarchy = [];
    for (const page of pages) {
      const children = await Page.findAll({
        where: { page_uuid: page.uuid },
      });

      page.dataValues.ChildPages = children;
      if (children.length > 0) {
        const nestedHierarchy = await organizePagesInHierarchy(children);
        page.dataValues.ChildPages = nestedHierarchy;
      }
      hierarchy.push(page);
    }

    return hierarchy;
  }

  fetchPagesWithDynamicChildInclude()
    .then((hierarchy) => {
      return res.status(200).json(hierarchy);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};
// const getScriptAndPages = await Page.findAll({
//   where: {
//     [Op.or]: [{ page_uuid: "90da8035-bfd1-429b-89e6-6b5be702ea8e" }],
// uuid: "90da8035-bfd1-429b-89e6-6b5be702ea8e",
// },
// include: [
//   {
//     model: Script,
//     where: {
//       uuid : script_uuid, // WHERE condition for the Page model
//     },
//   },
// ],
// });

const addScriptTitle = async (req, res) => {
  const scriptTitleUpdate = await Script.update(
    { title: req.query.inputValue },
    {
      where: { uuid: req.query.queryParameter },
    }
  );
  return res.status(200).json({ scriptTitleUpdate });
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
  getBatchAndScripts,
  getScriptAndPage,
  addScriptTitle,
  addPageData,
};
