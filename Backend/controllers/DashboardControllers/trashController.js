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

    let batch_id = [];
    for (allTrash of allTrashBatch) {
      batch_id.push(allTrash.uuid);
    }

    const allTrashScript = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: Batch,
          attributes: ["title"],
          where: {
            team_uuid: team_uuid,
          },
        },
      ],
    });

    const allTrashScripts = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
        batch_uuid: null,
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
        deleted_at: item.deleted_at,
        batch: item.batch.dataValues.title,
      };
    });

    if (allTrashBatch.length > 0) {
      for (let allTrashBatchs of allTrashBatch) {
        itemsWithDaysLeft.push(allTrashBatchs);
      }
    }
    for (let allTrashScriptsr of allTrashScripts) {
      itemsWithDaysLeft.push(allTrashScriptsr);
    }

    return res.status(200).json({
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
      };

      const deletedBatch = await Batch.update(updateData, {
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForBatch.uuid }],
        },
      });

      if (deletedBatch > 0) {
        const updatedTable = await Script.update(
          { deleted_at: sequelize.literal("NOW()") },
          {
            where: {
              batch_uuid: checkForBatch.uuid,
            },
          }
        );

        if (updatedTable > 0 || deletedBatch > 0) {
          return res
            .status(200)
            .json({ deletedBatch, message: "Folder Deleted Sucessfully" });
        } else {
          return res.status(500).json({ error: "Deleted Failed loooo" });
        }
      }
    }

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
      .json({ deletedScript, message: "Section Deleted Sucessfully" });
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

    const checkForBatch = await Batch.findOne({
      where: {
        team_uuid: team_uuid,
        uuid: batchOrScriptUuid,
      },
    });

    if (checkForScript) {
      const batchs = await Batch.findOne({
        where: {
          team_uuid: team_uuid,
          uuid: checkForScript.batch_uuid,
        },
      });

      if (batchs == null) {
        let updateData = {
          deleted_at: null,
        };

        const restoreScript = await Script.update(updateData, {
          where: {
            [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForScript.uuid }],
          },
        });

        if (restoreScript > 0) {
          return res.status(200).json({
            restoreScript,
            state: true,
            message: "Section Restore Sucessfully",
          });
        } else {
          return res.status(500).json({ error: "Restore Failed" });
        }
      }

      if (batchs.deleted_at == null) {
        let updateData = {
          deleted_at: null,
        };

        const restoreScript = await Script.update(updateData, {
          where: {
            [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForScript.uuid }],
          },
        });

        if (restoreScript > 0) {
          return res.status(200).json({
            restoreScript,
            state: true,
            message: "Section Restore Sucessfully",
          });
        } else {
          return res.status(500).json({ error: "Restore Failed" });
        }
      } else {
        return res.status(200).json({ state: false, message: "Can't Restore" });
      }
    }

    if (checkForBatch) {
      let updateData = {
        deleted_at: null,
      };
      const restoreBatch = await Batch.update(updateData, {
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: checkForBatch.uuid }],
        },
      });

      await Script.update(
        { deleted_at: null },
        {
          where: {
            [Op.and]: [
              { team_uuid: team_uuid },
              { batch_uuid: checkForBatch.uuid },
            ],
          },
        }
      );

      if (restoreBatch > 0) {
        return res.status(200).json({
          restoreBatch,
          state: true,
          message: "Folder and Scripts Restore Sucessfully",
        });
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
    const batchOrScriptuuid = req.params.batchOrScriptuuid;

    const checkForScript = await Script.findOne({
      where: {
        team_uuid: team_uuid,
        uuid: batchOrScriptuuid,
      },
    });

    if (checkForScript) {
      await Script.destroy({
        where: {
          [Op.and]: [{ team_uuid: team_uuid }, { uuid: batchOrScriptuuid }],
        },
      });
    }

    await Batch.destroy({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { uuid: batchOrScriptuuid }],
      },
    });

    return res
      .status(200)
      .json({ message: "Folders  or  Sections & Pages  Deleted Sucessfully" });
  } catch (err) {
    return res.status(404).json({ error: "Delete Failed or Can't Find" });
  }
};

const permanentDeleteAll = async (req, res) => {
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
    await Batch.destroy({
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

    const deleteResults = await Batch.destroy({
      where: {
        [Op.and]: [
          { team_uuid: team_uuid },
          { uuid: selectedUuids },
          { deleted_at: { [Op.not]: null } },
        ],
      },
    });

    if (deleteResult > 0 || deleteResults > 0) {
      return res.status(200).json({
        message: "Selected Folders  or Section  Deleted Successfully",
      });
    } else {
      return res
        .status(404)
        .json({ error: "No matching records found for deletion" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOldRecords = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find records older than 7 days
    const recordsToDelete = await Script.findAll({
      where: {
        deleted_at: {
          [Op.not]: null,
          [Op.lt]: sevenDaysAgo,
        },
      },
    });

    for (const record of recordsToDelete) {
      await record.destroy();
    }

    console.log(`${recordsToDelete.length} records deleted.`);
  } catch (error) {
    console.error("Error deleting old records:", error);
  }
};
// Schedule the function to run periodically (e.g., daily)
// This depends on the scheduling mechanism you choose (cron, task scheduler, etc.)
// For example, using a simple setTimeout for demonstration purposes:
const scheduleInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const scheduleDeletion = () => {
  deleteOldRecords(); // Initial run
  setInterval(deleteOldRecords, scheduleInterval); // Subsequent runs
};

module.exports = {
  getAllTrash,
  moveToTrash,
  restoreParticular,
  permanentDeleteParticular,
  permanentDeleteAll,
  selectedTrash,
  scheduleDeletion,
};
