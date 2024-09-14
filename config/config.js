require("dotenv").config();

module.exports = {
  development: {
    dialect: "postgres",
    url: process.env.DATABASE_PUBLIC_URL,
    define: {
      timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
    },
    dialectOptions: {
      ssl: {
        require: true, // Exigir SSL
        rejectUnauthorized: false, // Não rejeitar certificados SSL autoassinados
      },
    },
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
  },
};
