const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const { validateFields } = require("../middlewares/validationMiddleware");
const { uploadMultiple } = require("../middlewares/upload");

// Validações para criação e atualização de Places
const placeValidations = [
  body("name").notEmpty().withMessage("O nome é obrigatório"),
  body("desc").notEmpty().withMessage("A descrição é obrigatória"),
  body("endereco").notEmpty().withMessage("O endereço é obrigatório"),
  body("telefone").notEmpty().withMessage("O telefone é obrigatório"),
  body("placeId").notEmpty().withMessage("O placeId é obrigatório"),
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
  uploadMultiple,
  placeValidations,
  validateFields,
  placeController.createPlace
);

router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  uploadMultiple,
  placeController.updatePlace
);

console.log("Middleware uploadMultiple está definido:", uploadMultiple);

router.delete("/:id", authenticateToken, isAdmin, placeController.deletePlace);

module.exports = router;
