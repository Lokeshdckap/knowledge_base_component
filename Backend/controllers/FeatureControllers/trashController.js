const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Batch = db.batch;
const Script = db.script;

const getAllTrash = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;

    const allTrashBatch = await Batch.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
      },
    });
    const allTrashScript = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
      },
    });
    return res.status(200).json({
      allTrashBatch,
      allTrashScript,
      message: "AllTrash Fetched Sucessfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Fetched Failed" });
  }
};

const moveToTrash = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;

    const batchOrScriptUuid = req.params.batchOrScriptuuid;

    const checkForBatch = await Batch.findOne({
      where: {
        team_uuid: team_uuid,
        uuid: batchOrScriptUuid,
      },
    });
    const checkForScript = await Script.findOne({
      where: {
        team_uuid: team_uuid,
        uuid: batchOrScriptUuid,
      },
    });

    if (checkForBatch) {
      let updateData = {
        deleted_at: sequelize.literal("NOW()"),
      };
      const deletedBatch = await Batch.update(updateData, {
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForBatch.uuid }],
        },
      });
      if (deletedBatch > 0) {
        const updatedTable = await Script.update(updateData, {
          where: {
            batch_uuid: checkForBatch.uuid,
          },
        });
        if (updatedTable > 0) {
          return res
            .status(200)
            .json({ deletedBatch, message: "Batch Deleted Sucessfully" });
        } else {
          return res.status(500).json({ error: "Deleted Failed" });
        }
      }
    } else {
      let updateData = {
        deleted_at: sequelize.literal("NOW()"),
      };
      const deletedScript = await Script.update(updateData, {
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForScript.uuid }],
        },
      });
      return res
        .status(200)
        .json({ deletedScript, message: "Script Deleted Sucessfully" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Deleted Failed" });
  }
};
module.exports = {
  getAllTrash,
  moveToTrash,
};
