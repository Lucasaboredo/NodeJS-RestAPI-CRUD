const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mydb", "postgres", "postgres", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  } finally {
    await sequelize.close();
  }
})();
