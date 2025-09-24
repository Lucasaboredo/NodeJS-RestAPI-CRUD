const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mydb", "postgres", "postgres", {
  host: "localhost",
  port: 5433,            // << IMPORTANTE: tu contenedor expone 5433
  dialect: "postgres",
  logging: false
});

module.exports = sequelize;
