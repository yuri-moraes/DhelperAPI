const cors = require("cors");
const express = require("express");

// Rotas
const userRoutes = require("../routes/userRoutes");
const placeRoutes = require("../routes/placeRoutes");

const app = express();

require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/places", placeRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
