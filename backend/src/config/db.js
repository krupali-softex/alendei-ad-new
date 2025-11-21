const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

const sequelize = new Sequelize(
  process.env.POSTGRE_DB_NAME,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Ensure DB_DIALECT is properly set (e.g., "postgres")
    port: parseInt(process.env.DB_PORT) || 5432, // Default to 5432 if DB_PORT is not provided
    logging: false, // Enable logging (optional)
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    console.log(`DB Config: ${process.env.DB_HOST}, ${process.env.DB_PORT}`);
    await sequelize.authenticate();
    console.log("PostgreSQL connection has been established successfully!");

    // Sync models with the database (WARNING: `alter: true` may modify schema)
    await sequelize.sync({ alter: true });
    console.log("Models have been synchronized with the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    console.error("Stack Trace:", error.stack);
  }
};

module.exports = { sequelize, connectDB };

