const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Batch = db.batch;
const Script = db.script;
const Team = db.teams;
const Page = db.pages;
const uuid = require("uuid");
const slugify = require("slugify");

const getBatchApi = async (req, res) => {
  try {
    const batchs = await Batch.findAll({
      where: {
        team_uuid: req.params.team_uuid,
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      batchs,
      msg: "Sucessfully Fetched All Batches For This Team",
    });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

const getScriptApi = async (req, res) => {
  try {
    const script = await Script.findAll({
      where: {
        [Op.and]: [{ team_uuid: req.params.team_uuid }, { batch_uuid: null }],
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      script,
      msg: "Sucessfully Fetched All Scripts For This Team",
    });
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
};

const getBatchAndScriptsApi = async (req, res) => {
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
          attributes: [], // Exclude Batch details
          include: [
            {
              model: Team,
              where: {
                uuid: req.params.team_uuid, // WHERE condition for the Team model
              },
              attributes: [], // Exclude Team details
            },
          ],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "title",
        "team_uuid",
        "batch_uuid",
        "is_published",
        "path",
      ], // Include only the script attributes you need
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json({ result, msg: "Scripts Fetched Sucessfully for Batchs" });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

const getScriptForPageApi = async (req, res) => {
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

    fetchPagesWithDynamicChildInclude()
      .then((hierarchy) => {
        return res.status(200).json({
          hierarchy,
          msg: "Pages Fetched Sucessfully for Scripts",
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

module.exports = {
  getBatchApi,
  getScriptApi,
  getBatchAndScriptsApi,
  getScriptForPageApi,
};
