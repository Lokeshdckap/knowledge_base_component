const db = require("../../utils/database");
const { Op } = require("sequelize");
const { sequelize } = require("../../utils/database");
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
    const Pages = await Page.create({
      title: "Page Name",
      description: "Page Description",
      uuid: uuid.v4(),
      script_uuid: script.uuid,
      content: null,
      page_uuid: null,
    });
    return res.status(200).send({
      Success: "Your Script Created Sucessfully",
      pages: Pages,
    });
  } else {
    return res.status(500).send({
      Error: "Error Script Not Created",
    });
  }
};

const getBatch = async (req, res) => {
  const team_uuid = req.params.uuid;

  const batchs = await Batch.findAll({
    where: {
      team_uuid: req.params.uuid,
    },
  });

  const joinQuery = `
  SELECT batches.title, COUNT(*) as script_count
  FROM batches
  INNER JOIN scripts ON scripts.batch_uuid = batches.uuid where batches.team_uuid = :team_uuid
  GROUP BY batches.title`;

  const [results] = await sequelize.query(joinQuery, {
    replacements: { team_uuid },
  });
  // const results = await Batch.findAll({
  //   attributes: [
  //     'title',
  //     [db.Sequelize.fn('count', db.Sequelize.col('scripts.uuid')), 'script_count'],
  //   ],
  //   include: [
  //     {
  //       model: Script,
  //       attributes: [],
  //     },
  //   ],
  //   where: {
  //     team_uuid: req.params.uuid,
  //   },
  //   group: ['batch.id','batch.title'], // Use 'title' directly without an alias
  // });
  return res.status(200).send({ batchs, results });
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
<<<<<<< HEAD

  const script_uuid = req.params.script_uuid;
  
  const pages_uuid = req.params.page_uuid ? req.params.page_uuid : null;
=======
  // console.log(req.params);
  const script_uuid = req.params.script_uuid;
  const pages_uuid = req.params.uuid ? req.params.uuid :null ;
>>>>>>> feature_script

  const Pages = await Page.create({
    title: "Page Name",
    description: "Page Description",
    uuid: uuid.v4(),
    script_uuid: script_uuid,
    content: null,
    page_uuid: pages_uuid ? pages_uuid : null,
  });

  return res.status(200).json({ Pages });
};



const getScriptAndPage = async (req, res) => {
  const script_uuid = req.params.script_uuid;

  async function fetchPagesWithDynamicChildInclude() {
    const rootPages = await Page.findAll({
      // where: { page_uuid: null }, // Fetch root-level pages
      where: {
        [Op.and]: [{ page_uuid: null }, { script_uuid: script_uuid }],
      },
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

  const getScriptAndPages = await Script.findOne({
    where: { uuid: script_uuid },
  });

  fetchPagesWithDynamicChildInclude()
    .then((hierarchy) => {
      return res.status(200).json({ hierarchy, getScriptAndPages });
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

const updatePageData = async (req, res) => {
  const updateData = await Page.update(
    {
      title: req.body.title,
      description: req.body.description,
      content: JSON.stringify(req.body.content),
    },
    {
      where: { uuid: req.body.id },
    }
  );
  return res.status(200).json({ updateData });
};

const getPage = async (req, res) => {
  const pages = await Page.findAll({
    where: { uuid: req.params.uuid }, // Fetch root-level pages
  });

  // let data = JSON.parse(pages.content)
  return res.status(200).json({ pages });
};

const addBatchTitleAndDescription = async (req, res) => {

  const param1 = req.query.param1 ? req.query.param1 : null;

  const param2 = req.query.param2 ? req.query.param2 : null;

  const queryParameter = req.query.queryParameter;

  const updateData = {};

  if (param1) {
    updateData.title = param1;
  }

  if (param2) {
    updateData.description = param2;
  }

  try {
    const [numUpdated] = await Batch.update(updateData, {
      where: { uuid: queryParameter },
    });

    if (numUpdated > 0) {
      return res.status(200).json({ message: "Update successful" });
    } else {
      return res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
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
  updatePageData,
  getPage,
  addBatchTitleAndDescription,
};
