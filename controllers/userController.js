const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  // Obter todos os usuários
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, // Exclui as senhas da resposta
      });
      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar a lista de usuários. Tente novamente mais tarde.",
      });
    }
  },

  // Criar um novo usuário
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      // Hashear a senha antes de salvar no banco
      const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds de hashing

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Common",
      });

      return res.status(201).json(user);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          error:
            "O email fornecido já está em uso. Por favor, use outro email.",
        });
      } else {
        return res.status(500).json({
          error:
            "Não foi possível criar o usuário. Tente novamente mais tarde.",
        });
      }
    }
  },
  // Fazer login

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          error:
            "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
        });
      }

      // Compare a senha fornecida com o hash armazenado
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error:
            "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
        });
      }

      // Se a senha estiver correta, gerar o token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
      });
    }
  },
  // Obter o perfil do usuário logado
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado.",
        });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar seu perfil. Tente novamente mais tarde.",
      });
    }
  },

  // Obter um usuário pelo ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          error: `Nenhum usuário foi encontrado com o ID ${id}. Verifique e tente novamente.`,
        });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar o usuário. Tente novamente mais tarde.",
      });
    }
  },

  // Atualizar um usuário
  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const [updated] = await User.update(req.body, {
        where: { id },
      });

      if (updated) {
        const updatedUser = await User.findByPk(id, {
          attributes: { exclude: ["password"] },
        });
        return res.json(updatedUser);
      }

      return res.status(404).json({
        error: `Não foi possível encontrar um usuário com o ID ${id} para atualizar.`,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // Erros de validação
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: messages });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        // Violação de restrição única
        return res.status(400).json({
          error:
            "O email fornecido já está em uso. Por favor, use outro email.",
        });
      } else {
        return res.status(500).json({
          error:
            "Ocorreu um erro ao tentar atualizar o usuário. Tente novamente mais tarde.",
        });
      }
    }
  },

  // Deletar um usuário
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.destroy({
        where: { id },
      });

      if (deleted) {
        return res.status(204).send(); // Sem conteúdo, usuário deletado
      }

      return res.status(404).json({
        error: `Não foi possível encontrar um usuário com o ID ${id} para deletar.`,
      });
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao tentar deletar o usuário. Tente novamente mais tarde.",
      });
    }
  },
};
