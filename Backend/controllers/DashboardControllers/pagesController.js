const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const uuid = require("uuid");
const slugify = require("slugify");
const Script = db.script;
const Page = db.pages;
const Publish = db.published_contents;

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
      } while (existingValues.includes(uniqueValue));

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
        existingTitles.push(allPage.title.split("-")[1]);
      }
    }

    let newTitle;

    const randomNumber = await generateUniqueRandomAlphanumeric(
      existingTitles,
      length
    );

    if (req.body.title != page.title) {
      newTitle = `${req.body.title}-${randomNumber}`;
    } else if (req.body.title == "Page Name") {
      newTitle = `${req.body.title}-${randomNumber}`;
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
        emoji: req.body.emoji,
        updatedAt: "CURRENT_TIMESTAMP",
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
            updatedAt: "CURRENT_TIMESTAMP",
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
    return res.status(500).json({ error: "lll" });
  }
};

const permanentDeletePage = async (req, res) => {
  const deletePageAndChildren = async (pageId) => {
    // Delete the current page and its children recursively
    await Page.destroy({
      where: {
        uuid: pageId,
      },
    });

    // Find all child pages
    const childPages = await Page.findAll({
      where: {
        page_uuid: pageId,
      },
    });

    // Recursively delete each child page and its children
    for (const childPage of childPages) {
      await deletePageAndChildren(childPage.uuid);
    }
  };

  try {
    const page_uuid = req.params.uuid;

    // Find the page ID by UUID
    const page = await Page.findOne({
      where: {
        uuid: page_uuid,
      },
    });
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Call the recursive function to delete the page and its children
    await deletePageAndChildren(page.uuid);

    return res
      .status(200)
      .json({ page, Success: "Pages and Child Permanently Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Pages Permanent Delete Failed" });
  }
};

const mergeSourceDataToPublic = async (req, res) => {
  try {
    const script_uuid = req.body.script_uuid;

    await Script.update(
      {
        status: req.body.status,
      },
      {
        where: { uuid: req.body.script_uuid },
      }
    );

    const findMergeSourceData = await Page.findAll({
      where: {
        script_uuid: script_uuid,
      },
    });

    if (findMergeSourceData.length > 0) {
      await Promise.all(
        findMergeSourceData.map(async (data) => {
          // Use upsert instead of update
          await Publish.upsert(
            {
              id: data.id,
              uuid: data.uuid,
              title: data.title,
              description: data.description,
              content: data.content,
              script_uuid: data.script_uuid,
              page_uuid: data.page_uuid,
              path: data.path,
              emoji: data.emoji,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            },
            {
              where: {
                script_uuid: data.script_uuid,
              },
            }
          );
        })
      );

      return res.status(200).json({ msg: "Successfully Merged Your Request" });
    } else {
      return res.status(404).json({ msg: "404  Your Merge Request Failed" });
    }
  } catch (err) {
    return res.status(404).json({ msg: "404  Your Merge Request Failed" });
  }
};

module.exports = {
  getPage,
  addPageData,
  addChildPage,
  updatePageData,
  permanentDeletePage,
  mergeSourceDataToPublic,
};
