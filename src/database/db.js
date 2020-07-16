const { Sequelize } = require("sequelize");
const database = require("../config/dbConfig");

const sequelize = new Sequelize(
  database.database,
  database.usermane,
  database.password,
  {
    dialect: "sqlite",
    storage: "./src/database/db.sqlite",
  }
);

module.exports = sequelize;
