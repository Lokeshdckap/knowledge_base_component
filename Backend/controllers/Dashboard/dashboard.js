const db = require("../../utils/database");
const { Op } = require("sequelize");
const { sequelize } = require("../../utils/database");
const User = db.users;
const Team = db.teams;
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;
const Invite = db.invites;
const Roles = db.roles_type;
const UserTeams = db.user_team_members;
const Image = db.images_path;
const path = require("path");
const fs = require("fs");
const sendEmail = require("../../utils/sendEmails");
const jwt = require("jsonwebtoken");

const uuid = require("uuid");
const {
  createTeamSchema,
  createTypeSchema,
} = require("../../utils/validations");

const slugify = require("slugify");
const user_team_members = require("../../models/user_team_members");
// const documentTitle = 'My Document Title';

// const slug = slugify(documentTitle, { lower: true });

const createTeams = async (req, res) => {
  try {
    const { error } = createTeamSchema.validate(req.body);

    if (error) return res.status(409).json({ error: error.details[0].message });

    const team_name = req.body.team_name;
    // console.log(team_name);
    const user = req.user.id;

    // const teamExists = await Team.findOne(
    //   {
    //     where: {
    //       [Op.and]: [{ name: team_name }, { uuid: scriptId }],
    //     },
    //     }
    // );

    const teamExists = `select teams.name from user_team_members inner join teams on user_team_members.team_uuid = teams.uuid inner join users on user_team_members.user_uuid = users.uuid where users.uuid = :user and teams.name = :team_name `;

    const [results] = await sequelize.query(teamExists, {
      replacements: { user, team_name },
    });

    if (results.length) {
      return res
        .status(400)
        .send({ team_name: `${results[0].name} Team Is Already Exists` });
    } else {
      const newTeam = await Team.create({
        name: team_name,
        uuid: uuid.v4(),
      });

      const usersTeam = await UserTeams.create({
        user_uuid: req.user.id,
        uuid: uuid.v4(),
        team_uuid: newTeam.uuid,
        role_id: "1",
      });

      if (newTeam && usersTeam) {
        return res.status(200).send({
          Success: "Your Team Created Sucessfully",
          newTeam,
        });
      } else {
        return res.status(500).send({
          Error: "Error Team Not Created ll",
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      Error: err.message,
    });
  }
};

const getTeam = async (req, res) => {
  try {
    const Teams = await Team.findAll({
      where: { uuid: req.params.uuid },
    });

    return res.status(200).json(Teams);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const teamNameUpdate = async (req, res) => {
  try {
    const team_uuid = req.body.uuid;
    const updateName = req.body.name;
    const updateData = {};

    updateData.name = updateName;

    await Team.update(updateData, {
      where: { uuid: team_uuid },
    });

    return res.status(200).send({
      Success: "Your Team Name Sucessfully Changed",
    });
  } catch (err) {
    return res.status(400).send({
      Error: "Your Team Name Cannot Changed",
    });
  }
};

const getActiveUsersForTeam = async (req, res) => {
  try {
    const team_uuid = req.params.uuid;
    const userDetail = await User.findAll({
      attributes: ["username", "isAdmin", "email"],
      include: {
        model: UserTeams,
        where: { team_uuid: team_uuid }, // Filter by team_uuid
      },
    });
    return res.status(200).json({
      userDetail,
    });
  } catch (error) {
    console.error("Error executing the query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addNewBatch = async (req, res) => {
  const team_uuid = req.body.uuid;
  const batch = await Batch.create({
    uuid: uuid.v4(),
    team_uuid: team_uuid,
  });
  if (batch) {
    return res.status(200).send({
      Success: "Your Batch Created Sucessfully",
    });
  } else {
    return res.status(500).send({
      Error: "Error Batch Not Created",
    });
  }
};

const addNewScripts = async (req, res) => {
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

  // console.log(existingDocument);
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
};

const getBatch = async (req, res) => {
  const team_uuid = req.params.uuid;

  const batchs = await Batch.findAll({
    where: {
      team_uuid: req.params.uuid,
    },
  });

  const joinQuery = `
  SELECT batches.title, COUNT(*) as script_count
  FROM batches
  INNER JOIN scripts ON scripts.batch_uuid = batches.uuid where batches.team_uuid = :team_uuid
  GROUP BY batches.title`;

  const [results] = await sequelize.query(joinQuery, {
    replacements: { team_uuid },
  });
  // const results = await Batch.findAll({
  //   attributes: [
  //     'title',
  //     [db.Sequelize.fn('count', db.Sequelize.col('scripts.uuid')), 'script_count'],
  //   ],
  //   include: [
  //     {
  //       model: Script,
  //       attributes: [],
  //     },
  //   ],
  //   where: {
  //     team_uuid: req.params.uuid,
  //   },
  //   group: ['batch.id','batch.title'], // Use 'title' directly without an alias
  // });
  return res.status(200).json({ batchs, results });
};

const switchTeam = async (req, res) => {
  const selectedTeam = await Team.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  return res.status(200).send({
    selectedTeam,
  });
};

const getScript = async (req, res) => {
  const script = await Script.findAll({
    where: {
      [Op.and]: [{ team_uuid: req.params.uuid }, { batch_uuid: null }],
    },
  });
  return res.status(200).send({
    script,
  });
};

const getAllTeam = async (req, res) => {
  const user = req.user.id;
  const query = `select * from user_team_members inner join teams on user_team_members.team_uuid = teams.uuid inner join users on user_team_members.user_uuid = users.uuid where users.uuid = :user`;

  const [getAllTeam] = await sequelize.query(query, {
    replacements: { user },
  });
  return res.status(200).send({
    getAllTeam,
  });
};

const getBatchAndScripts = async (req, res) => {
  let result = await Script.findAll({
    include: [
      {
        model: Batch,
        where: {
          uuid: req.params.batch_uuid, // WHERE condition for the Batch model
        },

        include: [
          {
            model: Team,
            where: {
              uuid: req.params.team_uuid, // WHERE condition for the Team model
            },
          },
        ],
      },
    ],
  });
  // console.log(result,"result");
  return res.status(200).json({ result });
};

const addPageData = async (req, res) => {
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

  return res.status(200).json({ Pages });
};

const addChildPage = async (req, res) => {
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
  // console.log(count + 1);

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

  return res.status(200).json({ Pages });
};

const getScriptAndPage = async (req, res) => {
  const script_uuid = req.params.script_uuid;

  async function fetchPagesWithDynamicChildInclude() {
    const rootPages = await Page.findAll({
      // where: { page_uuid: null }, // Fetch root-level pages
      where: {
        [Op.and]: [{ page_uuid: null }, { script_uuid: script_uuid }],
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

  const getScriptAndPages = await Script.findOne({
    where: { uuid: script_uuid },
  });

  fetchPagesWithDynamicChildInclude()
    .then((hierarchy) => {
      return res.status(200).json({ hierarchy, getScriptAndPages });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

// const getScriptAndPages = await Page.findAll({
//   where: {
//     [Op.or]: [{ page_uuid: "90da8035-bfd1-429b-89e6-6b5be702ea8e" }],
// uuid: "90da8035-bfd1-429b-89e6-6b5be702ea8e",
// },
// include: [
//   {
//     model: Script,
//     where: {
//       uuid : script_uuid, // WHERE condition for the Page model
//     },
//   },
// ],
// });

const addScriptTitle = async (req, res) => {
  const paths =
    "/" +
    req.query.inputValue.split(" ").filter(Boolean).join("").toLowerCase();

  const scriptTitleUpdate = await Script.update(
    { title: req.query.inputValue, path: paths },
    {
      where: { uuid: req.query.queryParameter },
    }
  );

  const updatePath = await Page.findAll({
    where: { script_uuid: req.query.queryParameter },
  });

  const updateAllPages = async () => {
    for (const scriptPaths of updatePath) {
      let oldPath = scriptPaths.path.split("/")[1];
      let replaceTheNew = oldPath.replace(oldPath, req.query.inputValue);

      const pathArray = scriptPaths.path.split("/");
      pathArray.splice(1, 1, replaceTheNew);
      const updatedPath = pathArray.join("/");

      console.log(updatedPath);

      // Update the current row with its corresponding updatedPath
      scriptPaths.path = updatedPath.toLowerCase();
      await scriptPaths.save();
    }
  };

  updateAllPages();

  return res.status(200).json({ scriptTitleUpdate });
};

const updatePageData = async (req, res) => {
  let paths;

  console.log(req.body);

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

  if (page.page_uuid) {
    const parentPage = await Page.findOne({
      where: {
        uuid: page.page_uuid,
      },
    });

    paths =
      parentPage.path +
      "/" +
      req.body.title.split(" ").filter(Boolean).join("").toLowerCase();
  } else {
    paths =
      script.path +
      "/" +
      req.body.title.split(" ").filter(Boolean).join("").toLowerCase();
  }

  const updateData = await Page.update(
    {
      title: req.body.title,
      description: req.body.description,
      content: JSON.stringify(req.body.content),
      path: paths,
    },
    {
      where: { uuid: req.body.id },
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

      console.log(newPath);

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

  return res.status(200).json({ updateData });
};

const getPage = async (req, res) => {
  const pages = await Page.findAll({
    where: { uuid: req.params.uuid }, // Fetch root-level pages
  });

  // let data = JSON.parse(pages.content)
  return res.status(200).json({ pages });
};

const addBatchTitleAndDescription = async (req, res) => {
  const param1 = req.query.param1 ? req.query.param1 : null;

  const param2 = req.query.param2 ? req.query.param2 : null;

  const queryParameter = req.query.queryParameter;

  const updateData = {};

  if (param1) {
    updateData.title = param1;
  }

  if (param2) {
    updateData.description = param2;
  }

  try {
    const [numUpdated] = await Batch.update(updateData, {
      where: { uuid: queryParameter },
    });

    if (numUpdated > 0) {
      return res.status(200).json({ message: "Update successful" });
    } else {
      return res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const newDocuments = async (req, res) => {
  const script_uuid = "/" + req.params.slug;

  const script = await Script.findOne({
    where: { path: script_uuid },
  });

  async function fetchPagesWithDynamicChildInclude() {
    const rootPages = await Page.findAll({
      // where: { page_uuid: null }, // Fetch root-level pages
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
  fetchPagesWithDynamicChildInclude()
    .then((hierarchy) => {
      return res.status(200).json({ hierarchy, script });
    })
    .catch((error) => {
      return res.status(409).json({ error: error.message });
    });
};

const publicUrls = async (req, res) => {
  const script_uuid = req.params.slug;
  const checked = req.params.checked;

  const is_publishedCheck = await Script.findOne({
    where: { uuid: script_uuid },
  });

  let value = checked == "true" ? 1 : 0;

  // if(is_publishedCheck.is_published){
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
    return res.status(200).json({ publicUrl });
    // const publicUrl = await Page.findAll({
    //   where: { script_uuid },
    //   include: [{ model: Script, attributes: ["path", "is_published"] }], // Include the associated script with the 'script_name' attribute
    // });
    // return res.status(200).send(publicUrl);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating data", error: error.message });
  }
  // }
  //   else {
  //     try {
  //       await Script.update(
  //         {
  //           is_published : value
  //         },
  //         {
  //         where: { uuid: script_uuid }},

  //         );

  //         const publicUrl = await Script.findOne({
  //         where: { uuid:script_uuid },
  //       });
  //     return res.status(200).json({publicUrl});
  //       // const publicUrl = await Page.findAll({
  //       //   where: { script_uuid },
  //       //   include: [{ model: Script, attributes: ["path", "is_published"] }], // Include the associated script with the 'script_name' attribute
  //       // });
  //       // return res.status(200).send(publicUrl);
  //     } catch (error) {
  //       return res
  //         .status(500)
  //         .json({ message: "Error updating data", error: error.message });
  //     }
  //   // }
  // };
};

const particularPageRender = async (req, res) => {
  const { slug } = req.params;
  const wildcardValue = req.params[0];
  const path = `/${slug}/${wildcardValue}`;

  const publicUrl = await Page.findOne({
    where: { path: path },
  });
  return res.status(200).json({ publicUrl });
};

const inviteTeams = async (req, res) => {
  const email = req.body.email;
  const is_progress = 0;
  const team_uuid = req.body.team_uuid;
  const role = req.body.role;

  const exitsInviteUsers = await Invite.findOne({
    where: { email: email },
  });
  if (exitsInviteUsers) {
    return res.status(400).json(`${email} this email already sended invite`);
  } else {
    await Invite.create({
      email: email,
      is_progess: is_progress,
      uuid: uuid.v4(),
      team_uuid: team_uuid,
    });

    const exitsUsers = await User.findOne({
      where: { email: email },
    });

    let userId = exitsUsers ? exitsUsers.uuid : null;

    let payload = { id: userId, team_uuid: team_uuid, role: role };

    let inviteToken = jwt.sign(payload, process.env.secretKey, {
      expiresIn: 1 * 24 * 60 * 60 * 1000,
    });

    let link = `http://localhost:3000/join/${inviteToken}`;

    console.log(link);

    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../", "public", "emailTemplates/invite.html"),
      "utf8"
    );

    const emailink = emailTemplate.replace("{{link}}", link);

    await sendEmail(email, "Invite Notification", emailink);

    return res.status(200).json(`Invite Sended Sucucessfully to this ${email}`);
  }
};

// Roles creation by bulk seeding
const blukCreation = async () => {
  const existsRoles = await Roles.findAll({});
  if (existsRoles.length === 0) {
    await Roles.bulkCreate([
      { name: "admin" },
      { name: "viewer" },
      { name: "editor" },
    ])
      .then(() => {
        console.log("Default roles inserted successfully.");
      })
      .catch((error) => {
        console.error("Error inserting default roles:", error);
      });
  } else {
    console.log("Roles already exist.");
  }
};

blukCreation();

const updateInvite = async (req, res) => {
  const team_uuid = req.body.team_uuid;
  const role = req.body.role;

  const invitedData = await UserTeams.create({
    team_uuid: team_uuid,
    role_id: role,
    uuid: uuid.v4(),
    user_uuid: req.body.id,
  });

  // console.log(invitedData);
  return res.status(200).json({ invitedData });
};

const getScripts = async (req, res) => {
  const TeamId = req.params.uuid;

  const scriptId = req.params.slug;

  const script_batch = await Script.findOne({
    where: {
      [Op.and]: [{ team_uuid: TeamId }, { uuid: scriptId }],
    },
  });

  let result = await Script.findAll({
    include: [
      {
        model: Batch,
        where: {
          uuid: script_batch.batch_uuid, // WHERE condition for the Batch model
        },

        include: [
          {
            model: Team,
            where: {
              uuid: TeamId, // WHERE condition for the Team model
            },
          },
        ],
      },
    ],
  });
  return res.status(200).json({ script_batch, result });
};

const uploadImage = async (req, res) => {
  const { filename } = req.file;
  const path = `http://localhost:4000/uploads/${filename}`
  const page_uuid = req.body.uuid;
  try {
    const image = await Image.create({
      filename: path,
      uuid: uuid.v4(),
    });

    return res
      .status(200)
      .json({ success: true, message: "File uploaded successfully!", image });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "File upload failed." });
  }
};

  const globalSearch = async (req,res) =>{
    const { q } = req.query;
    if(!q){
      return res.status(404).json({ error: 'Datas Not Found' });
    }
    const whereClause = {
      title: {
        [Op.iLike]: `%${q}%`,
      },
    };
    try {
      const scripts = await Script.findAll({
        where: whereClause,
      });
     return res.status(200).json(scripts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
}
const fetchImage = async (req, res) => {
  try {
    const image = await Image.findOne({
      where: { uuid: "43943438-3b6c-4c26-820e-d0ca3810244a" },
    });

    return res
      .status(200)
      .json({ success: true, message: "File Founded!", image });
  } catch (error) {
    return res.status(500).json({ success: false, message: "File Not Found." });
  }
};


  const updateRole = async (req,res) => {
    let team_uuid = req.body.team_uuid;
    let role_type = req.body.role_type;
    let updateData = {
      role_id:role_type
    }
    try {
    const updatedRole = await UserTeams.update(updateData, {
      where: {
        [Op.and]: [{ team_uuid: team_uuid }, { user_uuid: req.body.user_uuid }],
      }
    });
    return res.status(200).json(updatedRole);

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }


  }

module.exports = {
  createTeams,
  getTeam,
  addNewBatch,
  getBatch,
  switchTeam,
  addNewScripts,
  getScript,
  getAllTeam,
  getBatchAndScripts,
  getScriptAndPage,
  addScriptTitle,
  addPageData,
  updatePageData,
  getPage,
  addBatchTitleAndDescription,
  addChildPage,
  newDocuments,
  publicUrls,
  particularPageRender,
  teamNameUpdate,
  getActiveUsersForTeam,
  inviteTeams,
  updateInvite,
  getScripts,
  uploadImage,
  globalSearch,
  updateRole,
  fetchImage
};
