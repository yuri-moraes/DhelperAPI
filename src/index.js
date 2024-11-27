const cors = require("cors");
const express = require("express");
const fs = require("fs");
const app = express();
const { sequelize } = require("../models");
const path = require("path");

sequelize
  .sync()
  .then(() => {
    console.log("As tabelas foram sincronizadas com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar tabelas:", err);
  });

require("dotenv").config();

//Cors
app.use(cors());

// Middlewares
app.use(express.json());

// Importando as rotas
const userRoutes = require("../routes/userRoutes");
const placeRoutes = require("../routes/placeRoutes");

const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Usando as rotas
app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use("/uploads", express.static(uploadDir));

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
