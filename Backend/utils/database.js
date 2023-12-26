//importing modules

const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using

const sequelize = new Sequelize(
  `postgres://dckap:admin@localhost:5432/knowledge_base`,
  { dialect: "postgres" }
);
//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to Knowledge Base Database`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.users = require("../models/users")(sequelize, DataTypes);

db.password_reset_token = require("../models/password_reset_token")(
  sequelize,
  DataTypes
);

db.email_verification_token = require("../models/email_verification_token")(
  sequelize,
  DataTypes
);

db.teams = require("../models/teams")(sequelize, DataTypes);

db.batch = require("../models/batch")(sequelize, DataTypes);

db.script = require("../models/script")(sequelize, DataTypes);

db.pages = require("../models/pages")(sequelize, DataTypes);

db.invites = require("../models/invites")(sequelize, DataTypes);

db.roles_type = require("../models/roles_type")(sequelize, DataTypes);

db.user_team_members = require("../models/user_team_members")(
  sequelize,
  DataTypes
);

db.images_path = require("../models/images_path")(sequelize, DataTypes);

db.access_tokens = require("../models/access_token")(sequelize, DataTypes);

db.users.hasMany(db.user_team_members, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.user_team_members.belongsTo(db.users, {
  foreignKey: "user_uuid",
  sourceKey: "uuid",
});

db.teams.hasMany(db.user_team_members, {
  foreignKey: "team_uuid",
  sourceKey: "uuid",
});

db.user_team_members.belongsTo(db.teams, {
  foreignKey: "team_uuid",
  sourceKey: "uuid",
});

db.teams.hasMany(db.batch, { foreignKey: "team_uuid", targetKey: "uuid" });

db.batch.belongsTo(db.teams, { foreignKey: "team_uuid", targetKey: "uuid" });

db.teams.hasMany(db.script, { foreignKey: "team_uuid", targetKey: "uuid" });

db.script.belongsTo(db.teams, { foreignKey: "team_uuid", targetKey: "uuid" });

db.batch.hasMany(db.script, { foreignKey: "batch_uuid", targetKey: "uuid" });

db.script.belongsTo(db.batch, { foreignKey: "batch_uuid", targetKey: "uuid" });

db.script.hasMany(
  db.pages,
  { foreignKey: "script_uuid", s: "uuid" },
  { onDelete: "CASCADE" }
);

db.pages.belongsTo(
  db.script,
  { foreignKey: "script_uuid", targetKey: "uuid" },
  { onDelete: "CASCADE" }
);

db.pages.belongsTo(db.pages, {
  as: "ParentPage",
  foreignKey: "page_uuid", // Define the join condition
  targetKey: "uuid",
});

db.pages.hasMany(db.pages, {
  as: "ChildPage",
  foreignKey: "page_uuid", // Define the join condition
  sourceKey: "uuid",
});

// db.users.hasMany(db.user_team_members, { foreignKey: "user_uuid", targetKey: "uuid" });

// db.user_team_members.belongsTo(db.users, { foreignKey: "user_uuid", targetKey: "uuid" });

//exporting the module

module.exports = db;
