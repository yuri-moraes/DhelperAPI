const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/login", userController.login);
router.post("/register", userController.createUser);

// Rotas protegidas (disponíveis apenas para usuários autenticados)
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.updateProfile);
router.get("/", authenticateToken, userController.getAllUsers);

// Rotas protegidas com restrição de administrador
router.get("/:id", authenticateToken, isAdmin, userController.getUserById); // Admin pode buscar usuário por ID
router.put("/:id", authenticateToken, isAdmin, userController.updateUser); // Admin pode atualizar usuários
router.delete("/:id", authenticateToken, isAdmin, userController.deleteUser); // Admin pode deletar usuários

module.exports = router;
