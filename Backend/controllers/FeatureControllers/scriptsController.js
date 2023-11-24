const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const uuid = require("uuid");
const slugify = require("slugify");
const Script = db.script;
const Page = db.pages;

const addNewScripts = async (req, res) => {
  try {
    const title = "untitled";

    const originalSlug = slugify(title, { lower: true });

    let slug = originalSlug;

    const team_uuid = req.body.uuid;
    const batch_uuid = req.body.batch_uuid ? req.body.batch_uuid : null;

    const script = await Script.create({
      uuid: uuid.v4(),
      team_uuid: team_uuid,
      batch_uuid: batch_uuid ? batch_uuid : null,
    });

    const existingDocument = await Script.findAll({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { batch_uuid: batch_uuid }],
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

      return res.status(200).send({
        Success: "Your Script Created Sucessfully",
        pages: Pages,
      });
    } else {
      return res.status(500).send({
        Error: "Error Script Not Created",
      });
    }
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
};

const getScript = async (req, res) => {
  try {
    const script = await Script.findAll({
      where: {
        [Op.and]: [{ team_uuid: req.params.uuid }, { batch_uuid: null }],
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      script,
      msg: "Sucessfully Fetched All Scripts",
    });
  } catch (err) {
    return res.status(500).send({
      Error: err,
    });
  }
};

const addScriptTitle = async (req, res) => {
  try {
    if (req.body.inputValue) {
      const checkTitles = await Script.findOne({
        where: {
          [Op.and]: [
            { team_uuid: req.body.teamParameter },
            sequelize.where(
              sequelize.fn("lower", sequelize.col("title")),
              sequelize.fn("lower", req.body.inputValue)
            ),
          ],
        },
      });
      if (!checkTitles) {
        const paths =
          "/" +
          req.body.inputValue.split(" ").filter(Boolean).join("").toLowerCase();

        const scriptTitleUpdate = await Script.update(
          { title: req.body.inputValue, path: paths },
          {
            where: { uuid: req.body.queryParameter },
          }
        );

        const updatePath = await Page.findAll({
          where: { script_uuid: req.body.queryParameter },
        });

        const updateAllPages = async () => {
          for (const scriptPaths of updatePath) {
            let oldPath = scriptPaths.path.split("/")[1];
            let replaceTheNew = oldPath.replace(oldPath, req.body.inputValue);

            const pathArray = scriptPaths.path.split("/");
            pathArray.splice(1, 1, replaceTheNew);
            const updatedPath = pathArray.join("/");

            // Update the current row with its corresponding updatedPath
            scriptPaths.path = updatedPath.toLowerCase();
            await scriptPaths.save();
          }
        };

        updateAllPages();

        return res.status(200).json({ scriptTitleUpdate });
      } else {
        return res
          .status(403)
          .json({ errorMsg: "Please Choose A Different Script Name" });
      }
    } else {
      const scriptTitleUpdate = await Script.update(
        { title: "Untitled Content" },
        {
          where: { uuid: req.body.queryParameter },
        }
      );
      return res
        .status(403)
        .json({ errorMsg: "Please Enter Script Name", scriptTitleUpdate });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ errorMsg: "Please Choose A Different Script Name" });
  }
};

module.exports = {
  addNewScripts,
  getScript,
  addScriptTitle,
};
