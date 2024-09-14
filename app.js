// app.js
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Importando as rotas
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");

// Usando as rotas
app.use("/users", userRoutes);
app.use("/places", placeRoutes);

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
