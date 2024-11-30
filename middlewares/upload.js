const multer = require("multer");
const fs = require("fs");
const { uploadDir } = require("../src/config");

// Verifique se a pasta existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de arquivo não suportado. Apenas JPEG e PNG são permitidos."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Configuração para múltiplos campos
const uploadMultiple = upload.fields([
  { name: "img", maxCount: 1 },
  { name: "fotos", maxCount: 5 },
]);

// Exportar corretamente
module.exports = { upload, uploadMultiple };
