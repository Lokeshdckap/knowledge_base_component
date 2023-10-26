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


db.teams.hasMany(db.batch, { foreignKey: 'team_uuid' ,targetKey: 'uuid'});

db.batch.belongsTo(db.teams, { foreignKey: "team_uuid",targetKey: 'uuid' });

db.teams.hasMany(db.script, { foreignKey: 'team_uuid',targetKey: 'uuid' });

db.script.belongsTo(db.teams, {foreignKey: 'team_uuid',targetKey: 'uuid'});

db.batch.hasMany(db.script, { foreignKey: "batch_uuid",targetKey: 'uuid'});

db.script.belongsTo(db.batch, {foreignKey: 'batch_uuid',targetKey: 'uuid'});

//exporting the module


module.exports = db;