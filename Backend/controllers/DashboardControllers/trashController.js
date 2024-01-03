const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");

const Batch = db.batch;
const Script = db.script;

const getAllTrash = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;

    const allTrashs = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
      },
    });

    let uniqueBatchUuids = new Set();
    let filteredAllTrashs = allTrashs.filter((allTrashed) => {
      if (
        allTrashed.batch_uuid &&
        !uniqueBatchUuids.has(allTrashed.batch_uuid)
      ) {
        uniqueBatchUuids.add(allTrashed.batch_uuid);
        return true;
      }
      return false;
    });
    let valuesArray = Array.from(uniqueBatchUuids);

    const allTrashss = await Batch.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
        uuid: {
          [Op.in]: valuesArray,
        },
      },
    });

    const allTrashBatch = await Batch.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
      },
    });
    let batch_uuid = [];
    for (allTrashBatchs of allTrashBatch) {
      batch_uuid.push(allTrashBatchs.uuid);
    }
    const allTrashses = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
        [Op.or]: [
          { batch_uuid: null },
          { batch_uuid: { [Op.notIn]: batch_uuid } },
        ],
      },
    });

    for (trash of allTrashBatch) {
      allTrashses.push(trash);
    }

    return res.status(200).json({
      allTrashses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Fetched Failed" });
  }
};

const getAllTrashScriptsForBatch = async (req, res) => {
  try {
    const team_uuid = req.params.team_uuid;
    const batch_uuid = req.params.batch_uuid;

    const allTrashScript = await Script.findAll({
      where: {
        team_uuid: team_uuid,
        deleted_at: {
          [Op.not]: null,
        },
        batch_uuid: batch_uuid,
      },
    });
    return res.status(200).json({
      allTrashScript,
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
  getAllTrashScriptsForBatch,
};
