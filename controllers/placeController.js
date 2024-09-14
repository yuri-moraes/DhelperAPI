// controllers/placeController.js

const { Place } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // Obter todos os lugares
  async getAllPlaces(req, res) {
    try {
      const places = await Place.findAll();
      return res.json(places);
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar a lista de lugares. Tente novamente mais tarde.",
      });
    }
  },

  // Criar um novo lugar
  async createPlace(req, res) {
    try {
      const place = await Place.create(req.body);
      return res.status(201).json(place);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // Erros de validação
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: messages });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        // Violação de restrição única
        return res.status(400).json({
          error: "Os dados fornecidos violam restrições de unicidade.",
        });
      } else {
        return res.status(500).json({
          error: "Não foi possível criar o lugar. Tente novamente mais tarde.",
        });
      }
    }
  },

  // Atualizar um lugar
  async updatePlace(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Place.update(req.body, {
        where: { id },
      });

      if (updated) {
        const updatedPlace = await Place.findOne({ where: { id } });
        return res.status(200).json(updatedPlace);
      }

      return res.status(404).json({
        error: `Não foi possível encontrar um lugar com o ID ${id} para atualizar.`,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // Erros de validação
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: messages });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        // Violação de restrição única
        return res.status(400).json({
          error: "Os dados fornecidos violam restrições de unicidade.",
        });
      } else {
        return res.status(500).json({
          error:
            "Ocorreu um erro ao tentar atualizar o lugar. Tente novamente mais tarde.",
        });
      }
    }
  },

  // Deletar um lugar
  async deletePlace(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Place.destroy({
        where: { id },
      });

      if (deleted) {
        return res.status(204).send();
      }

      return res.status(404).json({
        error: `Não foi possível encontrar um lugar com o ID ${id} para deletar.`,
      });
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao tentar deletar o lugar. Tente novamente mais tarde.",
      });
    }
  },

  // Obter um lugar pelo ID
  async getPlaceById(req, res) {
    try {
      const { id } = req.params;
      const place = await Place.findOne({ where: { id } });

      if (place) {
        return res.status(200).json(place);
      }

      return res.status(404).json({
        error: `Nenhum lugar foi encontrado com o ID ${id}. Verifique e tente novamente.`,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Ocorreu um erro ao buscar o lugar. Tente novamente mais tarde.",
      });
    }
  },

  // Buscar lugares por nome
  async getPlacesByName(req, res) {
    try {
      const { name } = req.query;
      const places = await Place.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });

      if (places.length > 0) {
        return res.status(200).json(places);
      }

      return res.status(404).json({
        error: `Nenhum lugar foi encontrado com o nome "${name}".`,
      });
    } catch (error) {
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar os lugares. Tente novamente mais tarde.",
      });
    }
  },
};
