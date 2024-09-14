const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_PUBLIC_URL, {
  dialect: "postgres",
  url: process.env.DATABASE_PUBLIC_URL,
  define: {
    timestamps: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialectModule: require("pg"),
});

module.exports = sequelize;
