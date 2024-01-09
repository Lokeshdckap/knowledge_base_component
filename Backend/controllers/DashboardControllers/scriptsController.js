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

    const existingDocument = await Script.findAll({});

    async function generateUniqueRandomAlphanumeric(existingValues, length) {
      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let uniqueValue;

      do {
        uniqueValue = Array.from(
          { length },
          () => characters[Math.floor(Math.random() * characters.length)]
        ).join("");
      } while (uniqueValue.includes(existingValues));

      return uniqueValue;
    }
    const length = 6;
    const existingTitles = [];
    for (let existingDocuments of existingDocument) {
      existingTitles.push(existingDocuments.title.slice(-7));
    }
    const randomNumber = await generateUniqueRandomAlphanumeric(
      existingTitles,
      length
    );

    if (existingDocument) {
      slug = `/${originalSlug}-${randomNumber}`;
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
        Success: "Your Section Created Sucessfully",
        pages: Pages,
      });
    } else {
      return res.status(500).send({
        Error: "Error Section Not Created",
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
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      script,
      msg: "Sucessfully Fetched All Section",
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

        const existingScript = await Script.findOne({
          where: { uuid: req.body.queryParameter },
        });

        const scriptTitleUpdate = await Script.update(
          {
            title: req.body.inputValue,
            path: existingScript.is_published ? existingScript.path : paths,
          },
          {
            where: { uuid: req.body.queryParameter },
          }
        );

        const updatePath = await Page.findAll({
          where: { script_uuid: req.body.queryParameter },
        });
        if (!existingScript.is_published) {
          const updateAllPages = async () => {
            for (const scriptPaths of updatePath) {
              let oldPath = scriptPaths.path.split("/")[1];
              let replaceTheNew = oldPath.replace(oldPath, req.body.inputValue);

              const pathArray = scriptPaths.path.split("/");
              pathArray.splice(1, 1, replaceTheNew);
              const updatedPath = pathArray.join("/");

              // Update the current row with its corresponding updatedPath
              scriptPaths.path = updatedPath
                .split(" ")
                .filter(Boolean)
                .join("")
                .toLowerCase();
              await scriptPaths.save();
            }
          };
          updateAllPages();
        }
        return res.status(200).json({ scriptTitleUpdate });
      } else {
        return res
          .status(403)
          .json({ errorMsg: "Please Choose A Different Section Name" });
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
        .json({ errorMsg: "Please Enter Section Name", scriptTitleUpdate });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ errorMsg: "Please Choose A Different Section Name" });
  }
};

const scriptLogo = async (req, res) => {
  try {
    const script_uuid = req.body.uuid;

    let scriptLogo;
    if (req.file) {
      const { filename } = req.file ? req.file : null;
      scriptLogo = `http://localhost:4000/uploads/${filename}`;
    }
    const scriptFind = await Script.findOne({
      where: {
        uuid: script_uuid,
      },
    });
    let updateData;
    if (scriptFind) {
      updateData = {
        logo: scriptLogo,
      };
      const scriptLogoUpdate = await Script.update(updateData, {
        where: {
          uuid: script_uuid,
        },
      });
      if (scriptLogoUpdate.length > 0) {
        return res
          .status(200)
          .json({ message: "Script Logo Update Sucessfully" });
      } else {
        return res.status(500).json({ message: "Script Logo Can't Update !" });
      }
    } else {
      return res.status(500).json({ message: "Script Logo Can't Update !" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Script Logo Can't Update !" });
  }
};

module.exports = {
  addNewScripts,
  getScript,
  addScriptTitle,
  scriptLogo,
};
