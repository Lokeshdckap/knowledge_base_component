const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;
const uuid = require("uuid");
const slugify = require("slugify");

const addNewBatch = async (req, res) => {
  try {
    const team_uuid = req.body.uuid;
    const title = "untitled";
    const originalSlug = slugify(title, { lower: true });
    let slug = originalSlug;

    const batch = await Batch.create({
      uuid: uuid.v4(),
      team_uuid: team_uuid,
    });

    const script = await Script.create({
      uuid: uuid.v4(),
      team_uuid: team_uuid,
      batch_uuid: batch.uuid,
    });

    const existingDocument = await Script.findAll({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { batch_uuid: batch.uuid }],
      },
    });
    if (existingDocument) {
      slug = `/${originalSlug}-${existingDocument.length}`;
    }

    const pathUpdate = await Script.update(
      { path: slug },
      {
        where: { uuid: script.uuid },
      }
    );

    const findOne = await Script.findOne({
      where: {
        uuid: script.uuid,
      },
    });

    if (script) {
      const title = "page";
      const originalSlug = slugify(title, { lower: true });
      let slug = originalSlug;
      let script_paths = findOne.path;

      const Pages = await Page.create({
        title: "Page Name",
        description: "Page Description",
        uuid: uuid.v4(),
        script_uuid: script.uuid,
        content: null,
        page_uuid: null,
      });

      const existPage = await Page.findAll({
        where: { script_uuid: script.uuid },
      });

      if (existPage) {
        slug = `${script_paths}/${originalSlug}-${existPage.length}`;
      }
      const pathUpdate = await Page.update(
        { path: slug },
        {
          where: {
            [Op.and]: [{ uuid: Pages.uuid }, { script_uuid: script.uuid }],
          },
        }
      );
    }
    if (batch) {
      return res.status(200).send({
        Success: "Your Batch Created Sucessfully",
      });
    } else {
      return res.status(500).send({
        Error: "Error Batch Not Created",
      });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      Error: "Error Batch Not Created",
    });
  }
};

const getBatch = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;

    const batchs = await Batch.findAll({
      where: {
        team_uuid: req.params.uuid,
        deleted_at:{
          [Op.is]: null,
        }
      },
      order: [["uuid", "DESC"]],
    });

    const joinQuery = `
  SELECT batches.uuid, COUNT(*) as script_count
  FROM batches
  INNER JOIN scripts ON scripts.batch_uuid = batches.uuid
  WHERE batches.team_uuid = :team_uuid
  GROUP BY batches.uuid
  ORDER BY batches.uuid DESC`;

    const [results] = await sequelize.query(joinQuery, {
      replacements: { team_uuid },
    });
    return res
      .status(200)
      .json({ batchs, results, msg: "Sucessfully Fetched All Batches" });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

const addBatchTitleAndDescription = async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;

    const updateData = {};

    if (title) {
      {
        updateData.title = title;
      }
    }
    if (description) {
      {
        updateData.description = description;
      }
    }

    try {
      if (title || description) {
        const [numUpdated] = await Batch.update(updateData, {
          where: { uuid: req.body.batch_uuid },
        });

        const numUpdatedData = await Batch.findOne({
          where: { uuid: req.body.batch_uuid },
        });

        if (numUpdated > 0) {
          return res
            .status(200)
            .json({ numUpdatedData, message: "Update successful" });
        } else {
          return res.status(404).json({ error: "Record not found" });
        }
      } else {
        return res.status(404).json({ error: "Please Enter Your Batch Name" });
      }
    } catch (error) {
      return res.status(404).json({ error: error });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};
module.exports = {
  addNewBatch,
  getBatch,
  addBatchTitleAndDescription,
};
