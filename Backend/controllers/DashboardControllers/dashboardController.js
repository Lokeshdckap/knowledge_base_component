const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;
const Roles = db.roles_type;
const Image = db.images_path;
const UserTeams = db.user_team_members;
const Access_Token = db.access_tokens;
const Publish = db.published_contents;
const config = process.env;
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const getBatchAndScripts = async (req, res) => {
  try {
    let result = await Script.findAll({
      where: {
        deleted_at: {
          [Op.is]: null,
        },
      },
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
      order: [["createdAt", "DESC"]],
    });
    const batchData = await Batch.findOne({
      where: { uuid: req.params.batch_uuid },
    });
    return res
      .status(200)
      .json({ batchData, result, msg: "Fetched Sucessfully Folders&Sections" });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

const getScriptAndPage = async (req, res) => {
  try {
    const script_uuid = req.params.script_uuid;

    async function fetchPagesWithDynamicChildInclude() {
      const rootPages = await Page.findAll({
        // where: { page_uuid: null }, // Fetch root-level pages
        where: {
          [Op.and]: [{ page_uuid: null }, { script_uuid: script_uuid }],
        },
        order: [["createdAt", "ASC"]],
      });

      const hierarchy = await organizePagesInHierarchy(rootPages);

      return hierarchy;
    }

    async function organizePagesInHierarchy(pages) {
      const hierarchy = [];
      for (const page of pages) {
        const children = await Page.findAll({
          where: { page_uuid: page.uuid },
          order: [["createdAt", "ASC"]],
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

    const pageCount = await Page.count({
      where: {
        [Op.and]: [{ script_uuid: script_uuid }, { page_uuid: null }],
      },
    });
    fetchPagesWithDynamicChildInclude()
      .then((hierarchy) => {
        return res.status(200).json({
          hierarchy,
          getScriptAndPages,
          pageCount,
          msg: "Fetched Sucessfully Section & Pages ",
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

// Roles creation by bulk seeding
const blukCreation = async () => {
  try {
    const existsRoles = await Roles.findAll({});
    if (existsRoles.length === 0) {
      await Roles.bulkCreate([
        { name: "admin" },
        { name: "viewer" },
        { name: "editor" },
      ])
        .then(() => {
          console.log("Default roles inserted successfully.");
        })
        .catch((error) => {
          console.error("Error inserting default roles:", error);
        });
    } else {
      console.log("Roles already exist.");
    }
  } catch (error) {
    console.error(error);
  }
};

blukCreation();

const getScripts = async (req, res) => {
  try {
    const TeamId = req.params.uuid;
    const scriptId = req.params.slug;
    if (TeamId && scriptId) {
      const script_batch = await Script.findOne({
        where: {
          [Op.and]: [{ team_uuid: TeamId }, { uuid: scriptId }],
        },
      });
      let result = await Script.findAll({
        where: {
          deleted_at: {
            [Op.is]: null,
          },
        },
        include: [
          {
            model: Batch,
            where: {
              uuid: script_batch.batch_uuid, // WHERE condition for the Batch model
            },
            include: [
              {
                model: Team,
                where: {
                  uuid: TeamId, // WHERE condition for the Team model
                },
              },
            ],
          },
        ],
      });
      return res
        .status(200)
        .json({ script_batch, result, msg: "Fetched Section Sucessfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { filename } = req.file;
    console.log(filename);
    const path = `http://localhost:4000/uploads/${filename}`;
    const page_uuid = req.body.uuid;
    try {
      const image = await Image.create({
        filename: path,
        uuid: uuid.v4(),
        page_uuid: page_uuid,
      });

      return res
        .status(200)
        .json({ success: true, message: "File uploaded successfully!", image });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed." });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    const team_uuid = req.params.uuid;
    if (!q) {
      return res.status(404).json({ error: "Datas Not Found" });
    }
    const whereClause = {
      title: {
        [Op.iLike]: `%${q}%`,
      },
    };
    try {
      const scripts = await Script.findAll({
        where: {
          [Op.and]: [whereClause, { team_uuid: team_uuid }, { deleted_at: null }],
        },
      });

      const script = await Script.findAll({
        where: {
          team_uuid: team_uuid,
        },
      });

      let script_uuid = [];

      for (let findScripts of script) {
        script_uuid.push(findScripts.uuid);
      }

      const pages = await Page.findAll({
        where: {
          [Op.and]: [whereClause, { script_uuid: script_uuid }],
        },
      });

      return res.status(200).json({ scripts, pages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const pageSearch = async (req, res) => {
  try {
    const { q } = req.query;
    const team_uuid = req.params.uuid;
    const slug = req.params.slug;

    const script = await Script.findOne({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { path: "/" + slug }],
      },
    });

    if (!q) {
      return res.status(404).json({ error: "Datas Not Found" });
    }
    const whereClause = {
      title: {
        [Op.iLike]: `%${q}%`,
      },
    };

    try {
      const pages = await Publish.findAll({
        // where: whereClause,
        where: {
          [Op.and]: [whereClause, { script_uuid: script.uuid }],
        },
      });
      
      return res.status(200).json(pages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getParentPage = async (req, res) => {
  try {
    async function traverseUpHierarchy(uuid, parents = []) {
      const pageData = await Page.findOne({
        where: { uuid },
      });

      if (pageData) {
        parents.push(pageData.uuid);

        if (pageData.page_uuid) {
          return traverseUpHierarchy(pageData.page_uuid, parents);
        } else {
          return parents.reverse(); // Reverse the array to have the main parent first
        }
      } else {
        return parents;
      }
    }
    // Usage
    const parentPages = await traverseUpHierarchy(req.params.uuid);
    // This will contain an array of parent page uuids, including the main parent

    return res
      .status(200)
      .json({ parentPages, message: "Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Updated Failed" });
  }
};

const paginationHandle = async (req, res) => {
  const script_uuid = req.params.uuid;

  const findPage = await Page.findAll({
    where: {
      script_uuid: script_uuid,
    },
  });

  return res.status(200).json({ findPage, message: "Fetched Successfully" });
};

const getApiTokens = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const pageSize = 5; // Number of tokens per page

    const { count, rows: access_tokens } = await Access_Token.findAndCountAll({
      where: {
        team_uuid: req.params.uuid,
      },

      order: [["createdAt", "ASC"]],

      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return res.status(200).json({
      msg: "Tokens Fetched Successfully",
      totalTokens: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      access_tokens,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createAccessToken = async (req, res) => {
  try {
    const team_uuid = req.body.uuid;

    const Teams = await Team.findAll({
      where: {
        uuid: team_uuid,
      },
    });

    const Team_Members = await UserTeams.findAll({
      where: {
        team_uuid: team_uuid,
      },
    });

    if (!Teams || Teams.length === 0) {
      if (!Team_Members || Team_Members.length === 0) {
        return res.status(404).json(`You Can't Access the Team`);
      }
    }
    const payload = { id: team_uuid };

    const token = jwt.sign(payload, config.secretKey);

    const createToken = await Access_Token.create({
      team_uuid: team_uuid,
      token: token,
      status: 1,
      uuid: uuid.v4(),
    });

    const access_token = await Access_Token.findAll({
      where: {
        team_uuid: team_uuid,
      },
    });

    return res
      .status(200)
      .json({ msg: "New Access Token Created Sucessfully", access_token });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const tokenStatusUpdate = async (req, res) => {
  try {
    const token = req.body.token;
    const updateStatus = req.body.status;
    const updateData = {};

    updateData.status = updateStatus;

    await Access_Token.update(updateData, {
      where: { token: token },
    });
    return res.status(200).send({
      Success: "Access Token Status Update Sucessfully",
    });
  } catch (err) {
    return res.status(500).send({
      Error: "Access Token Status Can't Update ",
    });
  }
};

module.exports = {
  getBatchAndScripts,
  getScriptAndPage,
  getScripts,
  uploadImage,
  globalSearch,
  getParentPage,
  pageSearch,
  paginationHandle,
  createAccessToken,
  getApiTokens,
  tokenStatusUpdate,
};
