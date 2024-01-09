const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Script = db.script;
const Page = db.pages;
const Publish = db.published_contents;
const uuid = require("uuid");

const publicUrls = async (req, res) => {
  try {
    const script_uuid = req.params.slug;

    const checked = req.params.checked;

    let value = checked == "true" ? 1 : 0;

    try {
      await Script.update(
        {
          is_published: value,
          status: "edit-request",
        },
        {
          where: { uuid: script_uuid },
        }
      );

      const publicUrl = await Script.findOne({
        where: { uuid: script_uuid },
      });

      async function migrateData() {
        try {
          // Check if data already exists in the destination table
          const checkExistData = await Publish.findOne({
            where: { script_uuid: script_uuid },
          });

          if (!checkExistData) {
            // Fetch data from the source table
            const sourceData = await Page.findAll({
              where: { script_uuid: script_uuid },
            });

            if (sourceData.length > 0) {
              // Map and bulk create in the destination table
              await Publish.bulkCreate(
                sourceData.map((data) => ({
                  id: data.id,
                  uuid: data.uuid,
                  title: data.title,
                  description: data.description,
                  content: data.content,
                  script_uuid: data.script_uuid,
                  page_uuid: data.page_uuid,
                  path: data.path,
                  emoji: data.emoji,
                })),
                { individualHooks: true }
              );
              console.log("Data migration successful");
            } else {
              console.log("No data found in the source table for migration.");
            }
          } else {
            console.log("Data migration already successful. No action needed.");
          }
        } catch (error) {
          console.error("Error migrating data:", error);
        }
      }

      migrateData();

      if (publicUrl.is_published) {
        return res
          .status(200)
          .json({ publicUrl, msg: "Published Sucessfully" });
      } 
      else {
        return res.status(200).json({ publicUrl, msg: "UnPublished Content" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating data", error: error.message });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

const newDocuments = async (req, res) => {
  try {
    const script_uuid = "/" + req.params.slug;
    console.log(script_uuid, "okk");
    const team_uuid = req.params.uuid;
    const wildcardValue = req.params[0];
    const path = `${script_uuid}/${wildcardValue}`;

    const script = await Script.findOne({
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { path: script_uuid }],
      },
    });

    async function fetchPagesWithDynamicChildInclude() {
      const rootPages = await Publish.findAll({
        where: {
          [Op.and]: [{ page_uuid: null }, { script_uuid: script.uuid }],
        },
        order: [["createdAt", "ASC"]],
      });

      const hierarchy = await organizePagesInHierarchy(rootPages);

      return hierarchy;
    }

    async function organizePagesInHierarchy(pages) {
      const hierarchy = [];
      for (const page of pages) {
        const children = await Publish.findAll({
          where: { page_uuid: page.uuid },
          order: [["createdAt", "ASC"]],
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
    const pageId = await Publish.findOne({
      where: { path: path },
    });
    let parentPages;
    if (pageId) {
      async function traverseUpHierarchy(uuid, parents = []) {
        const pageData = await Publish.findOne({
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

          msg: "All Sections & Pages Fetched Sucessfully",
        });
      })
      .catch((error) => {
        return res.status(404).json({ error: "Not Found" });
      });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

const particularPageRender = async (req, res) => {
  try {
    const { slug } = req.params;
    const wildcardValue = req.params[0];
    const path = `/${slug}/${wildcardValue}`;

    const publicUrl = await Publish.findOne({
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
  particularPageRender,
};
