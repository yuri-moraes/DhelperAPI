require("dotenv").config();

module.exports = {
  development: {
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
  },
  production: {
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
  },
};
