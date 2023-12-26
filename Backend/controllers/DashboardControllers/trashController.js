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
    const itemsWithDaysLeft = allTrashScript.map((item) => {
      const deletionTimestamp = item.deleted_at; // Get deletion timestamp from your data
      const now = new Date();
      const deletionDate = new Date(deletionTimestamp);
      let daysLeft = Math.ceil((deletionDate - now) / (1000 * 60 * 60 * 24));
      daysLeft = Math.min(daysLeft, 7);
      let left;
      if (daysLeft) {
        left = 7 - Math.abs(daysLeft);
      } else {
        left = 7;
      }
      return {
        id: item.id,
        uuid: item.uuid,
        title: item.title,
        team_uuid: item.team_uuid,
        path: item.path,
        is_published: item.is_published,
        createdAt: item.createdAt,
        updateAt: item.updatedAt,
        deleted_at: `${left} days left`,
      };
    });
    return res.status(200).json({
      allTrashBatch,
      itemsWithDaysLeft,
      message: "AllTrash Fetched Successfully",
    });
  } catch (error) {
    console.log(error);
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
        batch_uuid: null,
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
            .json({ deletedBatch, message: "Folder Deleted Sucessfully" });
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
        .json({ deletedScript, message: "Folder Deleted Sucessfully" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Deleted Failed" });
  }
};

const restoreParticular = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;

    const batchOrScriptUuid = req.params.batchOrScriptuuid;

    const checkForScript = await Script.findOne({
      where: {
        team_uuid: team_uuid,
        uuid: batchOrScriptUuid,
      },
    });
    if (checkForScript) {
      let updateData = {
        deleted_at: null,
      };
      const restoreScript = await Script.update(updateData, {
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForScript.uuid }],
        },
      });
      if (restoreScript > 0) {
        return res
          .status(200)
          .json({ restoreScript, message: "Section Restore Sucessfully" });
      } else {
        return res.status(500).json({ error: "Restore Failed" });
      }
    } else {
      return res.status(500).json({ error: "Restore Failed or Can't Find" });
    }
  } catch (err) {
    return res.status(404).json({ error: "Restore Failed" });
  }
};

const permanentDeleteParticular = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;
    const script_uuid = req.params.batchOrScriptuuid;
    await Script.destroy({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { uuid: script_uuid }],
      },
    });
    return res
      .status(200)
      .json({ message: "Sections & Pages  Deleted Sucessfully" });
  } catch (err) {
    return res.status(404).json({ error: "Delete Failed or Can't Find" });
  }
};

const permanentDeleteAll = async (req, res) => {
  const team_uuid = req.params.uuid;

  try {
    const team_uuid = req.params.uuid;
    await Script.destroy({
      where: {
        [Op.and]: [
          { team_uuid: team_uuid },
          {
            deleted_at: {
              [Op.not]: null,
            },
          },
        ],
      },
    });
    return res
      .status(200)
      .json({ Sucess: "All Section and Pages Permanent Deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: "All Section and Pages Permanent Delete Failed" });
  }
};

const selectedTrash = async (req, res) => {
  const team_uuid = req.params.uuid;
  const selectedUuids = req.body;
  console.log(req.body, "biy");

  try {
    const deleteResult = await Script.destroy({
      where: {
        [Op.and]: [
          { team_uuid: team_uuid },
          { uuid: selectedUuids },
          { deleted_at: { [Op.not]: null } },
        ],
      },
    });

    if (deleteResult > 0) {
      return res
        .status(200)
        .json({ message: "Selected Section Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ error: "No matching records found for deletion" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllTrash,
  moveToTrash,
  restoreParticular,
  permanentDeleteParticular,
  permanentDeleteAll,
  selectedTrash,
};
