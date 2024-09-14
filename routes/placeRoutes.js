// routes/placeRoutes.js

const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const { validateFields } = require("../middlewares/validationMiddleware");

// Validações para criação e atualização de Places
const placeValidations = [
  body("name").notEmpty().withMessage("O nome é obrigatório"),
  body("desc").notEmpty().withMessage("A descrição é obrigatória"),
  body("endereco").notEmpty().withMessage("O endereço é obrigatório"),
  body("telefone").notEmpty().withMessage("O telefone é obrigatório"),
  body("placeId").notEmpty().withMessage("O placeId é obrigatório"),
  body("img").notEmpty().withMessage("A imagem é obrigatória"),
];

// Rotas públicas

// Rota para buscar lugares por nome
router.get("/search", placeController.getPlacesByName);

// Rota para buscar lugar por ID
router.get("/:id", placeController.getPlaceById);

// Rota para obter todos os lugares
router.get("/", placeController.getAllPlaces);

// Rotas protegidas (somente admin)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  placeValidations,
  validateFields,
  placeController.createPlace
);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  placeValidations,
  validateFields,
  placeController.updatePlace
);
router.delete("/:id", authenticateToken, isAdmin, placeController.deletePlace);

module.exports = router;
