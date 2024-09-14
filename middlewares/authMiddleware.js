// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res
          .status(401)
          .json({ error: "Cabeçalho de autorização ausente" });
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2) {
        return res.status(401).json({ error: "Token mal formatado" });
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Formato do token inválido" });
      }

      if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // Diferenciar os tipos de erros
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" });
          } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token inválido" });
          } else {
            return res
              .status(401)
              .json({ error: "Falha na autenticação do token" });
          }
        }

        // Verificar se o payload contém as informações necessárias
        if (!decoded.id || !decoded.role) {
          return res
            .status(401)
            .json({ error: "Token inválido: informações ausentes" });
        }

        // Anexar o usuário decodificado ao objeto req
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };

        next();
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  isAdmin(req, res, next) {
    if (req.user && req.user.role === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ error: "Acesso negado. Usuário não é administrador." });
    }
  },
};
