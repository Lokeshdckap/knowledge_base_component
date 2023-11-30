const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const uuid = require("uuid");
const slugify = require("slugify");
const Script = db.script;
const Page = db.pages;

const getPage = async (req, res) => {
  try {
    const page_uuid = req.params.uuid;

    const pages = await Page.findOne({
      where: { uuid: page_uuid }, // Fetch root-level pages
    });

    return res.status(200).json({ pages, msg: "Sucessfully Fetched Page" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const addPageData = async (req, res) => {
  try {
    const script_uuid = req.params.script_uuid;

    const pages_uuid = req.params.uuid ? req.params.uuid : null;

    const script = await Script.findOne({
      where: {
        uuid: script_uuid,
      },
    });
    const title = "page";
    const originalSlug = slugify(title, { lower: true });
    let slug = originalSlug;

    const existingPage = await Page.findAll({
      where: {
        script_uuid: script_uuid,
      },
    });

    if (existingPage) {
      slug = `/${originalSlug}-${existingPage.length + 1}`;
    }

    const paths = `${script.path}${slug}`;

    const Pages = await Page.create({
      title: "Page Name",
      description: "Page Description",
      uuid: uuid.v4(),
      script_uuid: script_uuid,
      content: null,
      page_uuid: pages_uuid ? pages_uuid : null,
      path: paths,
    });

    return res
      .status(200)
      .json({ Pages, msg: "Your Page Was Created Sucessfully" });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

const addChildPage = async (req, res) => {
  try {
    const script_uuid = req.params.script_uuid;

    const pages_uuid = req.params.uuid;

    const title = "page";
    const originalSlug = slugify(title, { lower: true });
    let slug = originalSlug;

    const existingPage = await Page.findOne({
      where: {
        uuid: pages_uuid,
      },
    });

    const countQuery = `SELECT COUNT(*) FROM pages where script_uuid = :page_uuid`;
    let page_uuid = script_uuid;
    const [results] = await sequelize.query(countQuery, {
      replacements: { page_uuid },
    });

    let count = Number(results[0].count);

    if (existingPage) {
      slug = `${existingPage.path}/${originalSlug}-${count + 1}`;
    }

    const Pages = await Page.create({
      title: "Page Name",
      description: "Page Description",
      uuid: uuid.v4(),
      script_uuid: script_uuid,
      content: null,
      page_uuid: pages_uuid,
      path: slug,
    });

    return res
      .status(200)
      .json({ Pages, msg: "Your ChildPage Was Created Sucessfully" });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

const updatePageData = async (req, res) => {
  try {
    let paths;
    const page = await Page.findOne({
      where: {
        uuid: req.body.id,
      },
    });

    const script = await Script.findOne({
      where: {
        uuid: page.script_uuid,
      },
    });

    let titles;

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

    const pages = await Page.findAll({
      where: {
        script_uuid: page.script_uuid,
      },
    });
    const length = 6;

    const existingTitles = [];
    for (let allPage of pages) {
      if (allPage.title != "Page Name") {
        existingTitles.push(allPage.title.split("-")[0]);
      }
    }

    let newTitle;

    const randomNumber = await generateUniqueRandomAlphanumeric(
      existingTitles,
      length
    );

    if (req.body.title != page.title.split("-")[0]) {
      newTitle = `${req.body.title}-${randomNumber}`;
    } else {
      newTitle = `${req.body.title}`;
    }

    titles = newTitle ? newTitle : req.body.title;

    if (page.page_uuid) {
      const parentPage = await Page.findOne({
        where: {
          uuid: page.page_uuid,
        },
      });
      paths =
        parentPage.path +
        "/" +
        titles.split(" ").filter(Boolean).join("").toLowerCase();
    } else {
      paths =
        script.path +
        "/" +
        titles.split(" ").filter(Boolean).join("").toLowerCase();
    }
    const updateData = await Page.update(
      {
        title: titles,
        description: req.body.description,
        content: JSON.stringify(req.body.content),
        path: paths,
      },
      {
        where: {
          uuid: req.body.id,
        },
      }
    );

    async function updateChildPagePaths(parentPath, parentId) {
      const childpages = await Page.findAll({
        where: {
          page_uuid: parentId,
        },
      });
      for (let childpage of childpages) {
        const newPath = parentPath + "/" + childpage.path.split("/").pop();

        await Page.update(
          {
            path: newPath,
          },
          {
            where: { uuid: childpage.uuid },
          }
        );

        await updateChildPagePaths(newPath, childpage.uuid);
      }
    }

    const parentPage = await Page.findOne({
      where: {
        uuid: req.body.id,
      },
    });

    if (parentPage) {
      const parentPath = parentPage.path;
      await updateChildPagePaths(parentPath, parentPage.uuid);
    } else {
      console.log("Parent page not found");
    }

    return res
      .status(200)
      .json({ updateData, msg: "Your Content Was Updated Sucessfully" });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  getPage,
  addPageData,
  addChildPage,
  updatePageData,
};
