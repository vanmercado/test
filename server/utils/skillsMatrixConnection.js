const { Sequelize } = require("sequelize");

const dbName = "skills_matrix";
const SkillsMatrixConnection = new Sequelize(dbName, "root", "telus@mysql", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// const SkillsMatrixConnection = new Sequelize(
//   dbName,
//   "root",
//   "tuDKtHGqlm5I3BMs",
//   {
//     host: "34.87.15.124",
//     dialect: "mysql",
//     logging: false,
//   }
// );

module.exports = { SkillsMatrixConnection, dbName };
