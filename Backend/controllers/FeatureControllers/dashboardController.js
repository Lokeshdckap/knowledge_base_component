const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;
const Roles = db.roles_type;
const Image = db.images_path;
const uuid = require("uuid");

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
      .json({ batchData, result, msg: "Fetched Sucessfully Batch&Scripts" });
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
        return res.status(200).json({
          hierarchy,
          getScriptAndPages,
          msg: "Fetched Sucessfully Scripts & Pages ",
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
        .json({ script_batch, result, msg: "Fetched Scripts Sucessfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { filename } = req.file;
    const path = `http://localhost:4000/uploads/${filename}`;
    const page_uuid = req.body.uuid;
    try {
      const image = await Image.create({
        filename: path,
        uuid: uuid.v4(),
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
        // where: whereClause,
        where: {
          [Op.and]: [whereClause, { team_uuid: team_uuid }],
        },
      });

    //   let array = []

    //   for(let script of scripts){
    //      array.push(script.uuid)
    //   }
    //   const pages = await Page.findAll({
    //     // where: whereClause,
    //     where: {
    //       script_uuid:array
    //     },
        
    //   });
    //   for(let page of pages){
    //     scripts.push(page)
    //  }
      return res.status(200).json(scripts);
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
      const pages = await Page.findAll({
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

const fetchImage = async (req, res) => {
  try {
    const image = await Image.findOne({
      where: { uuid: "43943438-3b6c-4c26-820e-d0ca3810244a" },
    });

    return res
      .status(200)
      .json({ success: true, message: "File Founded!", image });
  } catch (error) {
    return res.status(500).json({ success: false, message: "File Not Found." });
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

module.exports = {
  getBatchAndScripts,
  getScriptAndPage,
  getScripts,
  uploadImage,
  globalSearch,
  fetchImage,
  getParentPage,
  pageSearch,
};
