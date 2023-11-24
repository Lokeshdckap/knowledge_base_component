const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Script = db.script;
const Page = db.pages;
const uuid = require("uuid");

const newDocuments = async (req, res) => {
  try {
    const script_uuid = "/" + req.params.slug;
    const team_uuid = req.params.uuid;
    const wildcardValue = req.params[0];
    const path = `${script_uuid}/${wildcardValue}`;

    const script = await Script.findOne({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { path: script_uuid }],
      },
    });

    async function fetchPagesWithDynamicChildInclude() {
      const rootPages = await Page.findAll({
        where: {
          [Op.and]: [{ page_uuid: null }, { script_uuid: script.uuid }],
        },
      });

      const hierarchy = await organizePagesInHierarchy(rootPages);

      return hierarchy;
    }

    async function organizePagesInHierarchy(pages) {
      const hierarchy = [];
      for (const page of pages) {
        const children = await Page.findAll({
          where: { page_uuid: page.uuid },
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
    const pageId = await Page.findOne({
      where: { path: path },
    });
    let parentPages;
    if (pageId) {
      async function traverseUpHierarchy(uuid, parents = []) {
        const pageData = await Page.findOne({
          where: { uuid },
        });

        if (pageData) {
          parents.push(pageData.uuid);

          if (pageData.page_uuid) {
            // Recursively call traverseUpHierarchy and accumulate results
            return traverseUpHierarchy(pageData.page_uuid, parents);
          } else {
            return parents.reverse(); // Reverse the array to have the main parent first
          }
        } else {
          return parents;
        }
      }
      parentPages = await traverseUpHierarchy(pageId.uuid);
    }
    // Usage
    fetchPagesWithDynamicChildInclude()
      .then((hierarchy) => {
        return res.status(200).json({
          parentPages,
          hierarchy,
          script,
          msg: "All Scripts & Pages Fetched Sucessfully",
        });
      })
      .catch((error) => {
        return res.status(409).json({ error: error.message });
      });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

const publicUrls = async (req, res) => {
  try {
    const script_uuid = req.params.slug;

    const checked = req.params.checked;

    let value = checked == "true" ? 1 : 0;

    try {
      await Script.update(
        {
          is_published: value,
        },
        {
          where: { uuid: script_uuid },
        }
      );
      const publicUrl = await Script.findOne({
        where: { uuid: script_uuid },
      });
      return res.status(200).json({ publicUrl, msg: "Sucessfully Published" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating data", error: error.message });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

const particularPageRender = async (req, res) => {
    try {
      const { slug } = req.params;
      const wildcardValue = req.params[0];
      const path = `/${slug}/${wildcardValue}`;
  
      const publicUrl = await Page.findOne({
        where: { path: path },
      });
      return res
        .status(200)
        .json({ publicUrl, msg: "Sucessfully Fetched Particular Page" });
    } catch (error) {
      return res.status(404).json({ error: error });
    }
  };

module.exports = {
  newDocuments,
  publicUrls,
  particularPageRender
};
