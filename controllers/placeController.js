const { Place } = require("../models");
const { Op } = require("sequelize");
const path = require("path");

const cloudinary = require("../src/cloudinaryConfig");

// Função para extrair o public_id da URL do Cloudinary
function getPublicIdFromUrl(url) {
  // Exemplo de URL:
  // https://res.cloudinary.com/seu_cloud_name/image/upload/v123456789/uploads/abc123def456.png

  // Vamos extrair a parte após '/upload/' e antes da extensão do arquivo
  const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

module.exports = {
  // Obter todos os lugares
  async getAllPlaces(req, res) {
    try {
      const places = await Place.findAll();
      console.log("Lugares buscados com sucesso:", places.length);
      console.log("Lugares retornados:", places);
      return res.json(places);
    } catch (error) {
      console.error("Erro ao buscar a lista de lugares:", error);
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar a lista de lugares. Tente novamente mais tarde.",
      });
    }
  },

  // Criar um novo lugar com upload de imagens
  async createPlace(req, res) {
    try {
      console.log("Arquivos recebidos:", req.files);
      console.log("Dados recebidos:", req.body);

      const { name, desc, endereco, telefone, nota, placeId } = req.body;

      if (!req.files || !req.files.img) {
        return res
          .status(400)
          .json({ error: "A imagem principal (img) é obrigatória." });
      }

      // Imagem principal
      const imgPath = req.files.img[0].path;

      // Imagens adicionais
      const fotosPaths = req.files.fotos
        ? req.files.fotos.map((file) => file.path)
        : [];

      // Criação no banco de dados
      const place = await Place.create({
        name,
        desc,
        endereco,
        telefone,
        nota,
        placeId,
        img: imgPath,
        fotos: fotosPaths,
      });

      return res.status(201).json(place);
    } catch (error) {
      console.error("Erro ao criar lugar:", error);
      res.status(500).json({
        error: "Erro ao criar lugar. Tente novamente mais tarde.",
      });
    }
  },

  // Atualizar um lugar
  async updatePlace(req, res) {
    try {
      const { id } = req.params;
      const { name, desc, endereco, telefone, nota, placeId } = req.body;

      const place = await Place.findByPk(id);

      if (!place) {
        return res.status(404).json({ error: "Lugar não encontrado." });
      }

      // Atualiza a imagem principal se uma nova imagem for enviada
      let updatedImg = place.img;
      if (req.files && req.files.img && req.files.img.length > 0) {
        // Extrai o public_id da imagem antiga
        const oldImageUrl = place.img;
        const oldImagePublicId = getPublicIdFromUrl(oldImageUrl);

        // Remove a imagem antiga do Cloudinary
        if (oldImagePublicId) {
          await cloudinary.uploader.destroy(oldImagePublicId);
        }

        // Obtém a URL da nova imagem
        updatedImg = req.files.img[0].path;
      }

      // Atualiza as fotos adicionais se novas fotos forem enviadas
      let updatedFotos = place.fotos;
      if (req.files && req.files.fotos && req.files.fotos.length > 0) {
        // Remove as fotos antigas do Cloudinary
        if (place.fotos && place.fotos.length > 0) {
          for (const fotoUrl of place.fotos) {
            const fotoPublicId = getPublicIdFromUrl(fotoUrl);
            if (fotoPublicId) {
              await cloudinary.uploader.destroy(fotoPublicId);
            }
          }
        }

        // Obtém as URLs das novas fotos
        updatedFotos = req.files.fotos.map((file) => file.path);
      }

      // Atualiza os campos do lugar
      await place.update({
        name: name || place.name,
        desc: desc || place.desc,
        endereco: endereco || place.endereco,
        telefone: telefone || place.telefone,
        nota: nota !== undefined ? nota : place.nota,
        placeId: placeId || place.placeId,
        img: updatedImg,
        fotos: updatedFotos,
      });

      console.log("Dados recebidos no body:", req.body);
      console.log("Arquivos recebidos:", req.files);


      return res.status(200).json(place);
    } catch (error) {
      console.error("Erro ao atualizar lugar:", error);
      return res.status(500).json({
        error: "Erro ao atualizar lugar. Tente novamente mais tarde.",
      });
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
        console.log(`Lugar com ID ${id} deletado com sucesso.`);
        return res.status(204).send();
      }

      console.warn(`Lugar com ID ${id} não encontrado para deleção.`);
      return res.status(404).json({
        error: `Não foi possível encontrar um lugar com o ID ${id} para deletar.`,
      });
    } catch (error) {
      console.error("Erro ao deletar lugar:", error);
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
        console.log("Lugar encontrado:", place);
        return res.status(200).json(place);
      }

      console.warn(`Nenhum lugar encontrado com o ID ${id}.`);
      return res.status(404).json({
        error: `Nenhum lugar foi encontrado com o ID ${id}. Verifique e tente novamente.`,
      });
    } catch (error) {
      console.error("Erro ao buscar lugar por ID:", error);
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
        console.log(`Lugares encontrados pelo nome "${name}":`, places.length);
        return res.status(200).json(places);
      }

      console.warn(`Nenhum lugar encontrado com o nome "${name}".`);
      return res.status(404).json({
        error: `Nenhum lugar foi encontrado com o nome "${name}".`,
      });
    } catch (error) {
      console.error("Erro ao buscar lugares por nome:", error);
      return res.status(500).json({
        error:
          "Ocorreu um erro ao buscar os lugares. Tente novamente mais tarde.",
      });
    }
  },
};
